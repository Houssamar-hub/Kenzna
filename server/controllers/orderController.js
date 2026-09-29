import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// Helper to generate unique order number like #KNZ-1024
const generateOrderNumber = async () => {
  const count = await Order.countDocuments();
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `KNZ-${1000 + count + 1}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public / Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    customerInfo,
    shippingAddress,
    paymentMethod,
    couponCode,
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('لا توجد منتجات في الطلب');
  }

  if (!customerInfo || !customerInfo.fullName || !customerInfo.phone) {
    res.status(400);
    throw new Error('يرجى إدخال معلومات العميل كاملة (الاسم ورقم الهاتف)');
  }

  if (!shippingAddress || !shippingAddress.city || !shippingAddress.address) {
    res.status(400);
    throw new Error('يرجى إدخال عنوان التوصيل كاملاً');
  }

  // Calculate items total & verify prices
  let itemsPrice = 0;
  const verifiedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`المنتج ${item.name || item.product} غير متوفر`);
    }

    // Determine correct price based on weight option
    let price = product.price;
    if (item.weight && product.weights && product.weights.length > 0) {
      const matchWeight = product.weights.find(w => w.weight === item.weight);
      if (matchWeight) {
        price = matchWeight.price;
      }
    }

    const itemTotal = price * item.quantity;
    itemsPrice += itemTotal;

    verifiedItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      weight: item.weight || '250g',
      quantity: item.quantity,
      price: price,
    });

    // Decrement stock
    product.stock = Math.max(0, product.stock - item.quantity);
    await product.save();
  }

  // Shipping calculation: Free shipping for orders >= 300 MAD, else 25 MAD
  const shippingPrice = itemsPrice >= 300 ? 0 : 25;

  // Coupon calculation
  let discountAmount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      expiryDate: { $gte: new Date() },
    });

    if (coupon && itemsPrice >= (coupon.minOrderAmount || 0)) {
      appliedCoupon = coupon.code;
      if (coupon.discountType === 'percentage') {
        discountAmount = (itemsPrice * coupon.discountValue) / 100;
        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
          discountAmount = coupon.maxDiscountAmount;
        }
      } else {
        discountAmount = coupon.discountValue;
      }

      // Increment coupon usage
      coupon.usedCount = (coupon.usedCount || 0) + 1;
      await coupon.save();
    }
  }

  const totalAmount = Math.max(0, itemsPrice + shippingPrice - discountAmount);
  const orderNumber = await generateOrderNumber();

  const order = new Order({
    orderNumber,
    user: req.user ? req.user._id : undefined,
    customerInfo,
    shippingAddress,
    items: verifiedItems,
    paymentMethod: paymentMethod || 'COD',
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    statusHistory: [{
      status: 'Pending',
      date: new Date(),
      note: 'تم استلام الطلب وهو في انتظار التأكيد',
    }],
    itemsPrice,
    shippingPrice,
    discountAmount,
    couponCode: appliedCoupon,
    totalAmount,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('items.product', 'name images slug');

  res.json(orders);
});

// @desc    Get single order by ID or orderNumber
// @route   GET /api/orders/:id
// @access  Public / Private
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let order;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    order = await Order.findById(id).populate('items.product', 'name slug images');
  } else {
    order = await Order.findOne({ orderNumber: id.toUpperCase() }).populate('items.product', 'name slug images');
  }

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('الطلب غير موجود');
  }
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const { status, limit = 100 } = req.query;
  const filter = {};

  if (status && status !== 'all') {
    filter.orderStatus = status;
  }

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate('user', 'name email phone');

  res.json(orders);
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = status;
    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    order.statusHistory.push({
      status,
      date: new Date(),
      note: note || `تم تغيير حالة الطلب إلى ${status}`,
    });

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('الطلب غير موجود');
  }
});

// @desc    Track order by orderNumber or ID (Public)
// @route   GET /api/orders/track/:query
// @access  Public
export const trackOrder = asyncHandler(async (req, res) => {
  const { query } = req.params;
  const { phone } = req.query;

  const searchQuery = {
    $or: [
      { orderNumber: query.toUpperCase() },
      { orderNumber: query },
    ],
  };

  // If valid ObjectId, also check _id
  if (query.match(/^[0-9a-fA-F]{24}$/)) {
    searchQuery.$or.push({ _id: query });
  }

  const order = await Order.findOne(searchQuery);

  if (!order) {
    res.status(404);
    throw new Error('لم يتم العثور على الطلب');
  }

  // If phone query provided, verify customer phone
  if (phone && phone.trim()) {
    const cleanUserPhone = phone.trim().replace(/\D/g, '');
    const cleanOrderPhone = (order.customerInfo?.phone || '').replace(/\D/g, '');
    if (cleanUserPhone && cleanOrderPhone && !cleanOrderPhone.includes(cleanUserPhone) && !cleanUserPhone.includes(cleanOrderPhone)) {
      res.status(403);
      throw new Error('رقم الهاتف غير مطابق لبيانات الطلب');
    }
  }

  res.json(order);
});

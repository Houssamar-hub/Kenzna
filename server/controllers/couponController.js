import asyncHandler from 'express-async-handler';
import Coupon from '../models/Coupon.js';

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount = 0 } = req.body;

  if (!code) {
    res.status(400);
    throw new Error('يرجى إدخال رمز الكوبون');
  }

  const coupon = await Coupon.findOne({
    code: code.trim().toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    res.status(404);
    throw new Error('رمز الكوبون غير صالح أو غير موجود');
  }

  if (new Date(coupon.expiryDate) < new Date()) {
    res.status(400);
    throw new Error('انتهت صلاحية هذا الكوبون');
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error('تم استنفاد الحد الأقصى لاستخدام هذا الكوبون');
  }

  if (orderAmount < coupon.minOrderAmount) {
    res.status(400);
    throw new Error(`الحد الأدنى لتطبيق هذا الكوبون هو ${coupon.minOrderAmount} درهم`);
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  } else {
    discountAmount = Math.min(orderAmount, coupon.discountValue);
  }

  res.json({
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount: Math.round(discountAmount * 100) / 100,
    message: `تم تطبيق خصم ${coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `${coupon.discountValue} درهم`} بنجاح 🎉`,
  });
});

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
});

// @desc    Create a coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscountAmount,
    expiryDate,
    usageLimit,
    isActive,
  } = req.body;

  const existing = await Coupon.findOne({ code: code.toUpperCase() });
  if (existing) {
    res.status(400);
    throw new Error('رمز الكوبون موجود بالفعل');
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountType: discountType || 'percentage',
    discountValue: Number(discountValue),
    minOrderAmount: Number(minOrderAmount) || 0,
    maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
    expiryDate: new Date(expiryDate),
    usageLimit: Number(usageLimit) || 1000,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json(coupon);
});

// @desc    Update coupon (Admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    if (req.body.code) coupon.code = req.body.code.toUpperCase();
    if (req.body.discountType) coupon.discountType = req.body.discountType;
    if (req.body.discountValue !== undefined) coupon.discountValue = Number(req.body.discountValue);
    if (req.body.minOrderAmount !== undefined) coupon.minOrderAmount = Number(req.body.minOrderAmount);
    if (req.body.maxDiscountAmount !== undefined) coupon.maxDiscountAmount = Number(req.body.maxDiscountAmount);
    if (req.body.expiryDate) coupon.expiryDate = new Date(req.body.expiryDate);
    if (req.body.usageLimit !== undefined) coupon.usageLimit = Number(req.body.usageLimit);
    if (req.body.isActive !== undefined) coupon.isActive = req.body.isActive;

    const updated = await coupon.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('الكوبون غير موجود');
  }
});

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    await coupon.deleteOne();
    res.json({ message: 'تم حذف الكوبون بنجاح' });
  } else {
    res.status(404);
    throw new Error('الكوبون غير موجود');
  }
});

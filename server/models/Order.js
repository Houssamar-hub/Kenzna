import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  weight: { type: String, required: true, default: '250g' },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  customerInfo: {
    fullName: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
  },
  shippingAddress: {
    city: { type: String, required: true },
    district: { type: String },
    address: { type: String, required: true },
    notes: { type: String },
  },
  items: [orderItemSchema],
  paymentMethod: {
    type: String,
    required: true,
    default: 'COD', // Cash on Delivery
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String,
  }],
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  discountAmount: {
    type: Number,
    default: 0.0,
  },
  couponCode: {
    type: String,
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0.0,
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;

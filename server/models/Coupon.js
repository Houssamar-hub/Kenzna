import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'يرجى إدخال رمز الكوبون'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  discountValue: {
    type: Number,
    required: [true, 'يرجى إدخال قيمة الخصم'],
  },
  minOrderAmount: {
    type: Number,
    default: 0,
  },
  maxDiscountAmount: {
    type: Number,
  },
  expiryDate: {
    type: Date,
    required: [true, 'يرجى تحديد تاريخ انتهاء الكوبون'],
  },
  usageLimit: {
    type: Number,
    default: 1000,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;

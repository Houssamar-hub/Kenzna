import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: [true, 'يرجى تحديد التقييم من 1 إلى 5'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, 'يرجى كتابة تعليقك'],
    trim: true,
  },
  verifiedPurchase: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;

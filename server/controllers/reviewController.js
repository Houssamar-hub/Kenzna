import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
  res.json(reviews);
});

// @desc    Create product review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  if (!productId || !rating || !comment) {
    res.status(400);
    throw new Error('يرجى تحديد التقييم وكتابة التعليق');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }

  // Check if user already reviewed
  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user._id,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('لقد قمت بتقييم هذا المنتج مسبقاً');
  }

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    userName: req.user.name,
    rating: Number(rating),
    comment,
  });

  // Recalculate product rating
  const allReviews = await Review.find({ product: productId });
  product.numReviews = allReviews.length;
  product.rating =
    allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;
  product.rating = Math.round(product.rating * 10) / 10;

  await product.save();
  res.status(201).json(review);
});

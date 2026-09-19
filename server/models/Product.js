import mongoose from 'mongoose';

const weightOptionSchema = new mongoose.Schema({
  weight: {
    type: String, // '250g', '500g', '1kg'
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
  },
  stock: {
    type: Number,
    default: 50,
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'يرجى إدخال اسم المنتج'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'يرجى إدخال وصف المنتج'],
  },
  shortDescription: {
    type: String,
    default: '',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'يرجى اختيار تصنيف المنتج'],
  },
  images: [{
    type: String,
    required: true,
  }],
  price: {
    type: Number,
    required: [true, 'يرجى إدخال السعر الأساسي'],
  },
  oldPrice: {
    type: Number,
  },
  weights: [weightOptionSchema],
  stock: {
    type: Number,
    required: [true, 'يرجى إدخال كمية المخزون'],
    default: 100,
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  bestSeller: {
    type: Boolean,
    default: false,
  },
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  origin: {
    type: String,
    default: 'المغرب',
  },
  benefits: [{
    type: String,
  }],
  nutritionFacts: {
    calories: String,
    protein: String,
    fats: String,
    carbs: String,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
export default Product;

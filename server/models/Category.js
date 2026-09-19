import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'يرجى إدخال اسم التصنيف'],
    unique: true,
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
    default: '',
  },
  image: {
    type: String,
    required: [true, 'يرجى إضافة صورة للتصنيف'],
  },
  icon: {
    type: String,
    default: 'Nut',
  },
  itemCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);
export default Category;

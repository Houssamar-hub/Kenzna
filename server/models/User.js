import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  title: { type: String, default: 'المنزل' },
  city: { type: String, required: true },
  district: { type: String },
  street: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'يرجى إدخال الاسم الكامل'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'يرجى إدخال البريد الإلكتروني'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'يرجى إدخال بريد إلكتروني صحيح'],
  },
  phone: {
    type: String,
    required: [true, 'يرجى إدخال رقم الهاتف'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'يرجى إدخال كلمة المرور'],
    minlength: [6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  addresses: [addressSchema],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;

import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'kenzna_super_secret_jwt_key_2026_morocco', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    res.status(400);
    throw new Error('يرجى ملء جميع الحقول المطلوبة');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('البريد الإلكتروني مستخدم بالفعل');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'user',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('فشل إنشاء الحساب، بيانات غير صالحة');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
  }

  const user = await User.findOne({ email }).select('+password').populate('favorites');

  if (user && (await user.matchPassword(password))) {
    if (!user.isActive) {
      res.status(403);
      throw new Error('تم تعطيل هذا الحساب. يرجى التواصل مع الإدارة.');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses,
      favorites: user.favorites,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }
});

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses,
      favorites: user.favorites,
    });
  } else {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }
});

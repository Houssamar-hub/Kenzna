import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Protect routes - for logged in users
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kenzna_super_secret_jwt_key_2026_morocco');
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('المستخدم غير موجود أو تم حذفه');
      }

      if (!req.user.isActive) {
        res.status(403);
        throw new Error('تم تعطيل هذا الحساب. يرجى التواصل مع الإدارة.');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('غير مصرح لك بالوصول، الرمز غير صالح أو منتهي الصلاحية');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('يرجى تسجيل الدخول للوصول إلى هذه الخدمة');
  }
});

// Admin role check middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('غير مصرح لك بالوصول: هذه العملية مخصصة للمدير فقط');
  }
};

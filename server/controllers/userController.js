import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Order from '../models/Order.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error('البريد الإلكتروني مستخدم بالفعل');
      }
      user.email = req.body.email;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      addresses: updatedUser.addresses,
    });
  } else {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }
});

// @desc    Add shipping address
// @route   POST /api/users/addresses
// @access  Private
export const addAddress = asyncHandler(async (req, res) => {
  const { title, city, district, street, phone, isDefault } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }

  if (isDefault) {
    user.addresses.forEach(addr => { addr.isDefault = false; });
  }

  user.addresses.push({
    title: title || 'عنوان جديد',
    city,
    district,
    street,
    phone,
    isDefault: isDefault || user.addresses.length === 0,
  });

  await user.save();
  res.status(201).json(user.addresses);
});

// @desc    Delete shipping address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }

  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== req.params.addressId
  );

  await user.save();
  res.json(user.addresses);
});

// @desc    Toggle favorite product
// @route   POST /api/users/favorites/:productId
// @access  Private
export const toggleFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  if (!user) {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }

  const isFav = user.favorites.some((id) => id.toString() === productId);

  if (isFav) {
    user.favorites = user.favorites.filter((id) => id.toString() !== productId);
  } else {
    user.favorites.push(productId);
  }

  await user.save();
  const populatedUser = await User.findById(req.user._id).populate('favorites');
  res.json({ favorites: populatedUser.favorites, isFavorite: !isFav });
});

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');
  if (!user) {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }
  res.json(user.favorites || []);
});

// ADMIN CONTROLLERS

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  
  // Attach order count for each user
  const usersWithStats = await Promise.all(
    users.map(async (u) => {
      const orderCount = await Order.countDocuments({ user: u._id });
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
        orderCount,
      };
    })
  );

  res.json(usersWithStats);
});

// @desc    Update user role / active status (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }

  if (req.body.role) user.role = req.body.role;
  if (typeof req.body.isActive === 'boolean') user.isActive = req.body.isActive;

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    isActive: updatedUser.isActive,
  });
});

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }

  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('لا يمكنك حذف حسابك الخاص كمدير');
  }

  await user.deleteOne();
  res.json({ message: 'تم حذف المستخدم بنجاح' });
});

import express from 'express';
import {
  updateUserProfile,
  addAddress,
  deleteAddress,
  toggleFavorite,
  getFavorites,
  getUsers,
  updateUserByAdmin,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User profile & preferences
router.put('/profile', protect, updateUserProfile);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.post('/favorites/:productId', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

// Admin user management
router.get('/', protect, admin, getUsers);
router.put('/:id', protect, admin, updateUserByAdmin);
router.delete('/:id', protect, admin, deleteUser);

export default router;

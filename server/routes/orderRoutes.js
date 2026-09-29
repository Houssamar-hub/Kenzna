import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  trackOrder,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Optional token decoding middleware for guest/auth checkout
const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.route('/')
  .post(optionalProtect, createOrder)
  .get(protect, admin, getOrders);

router.get('/my-orders', protect, getMyOrders);
router.get('/track/:query', trackOrder);
router.get('/:id', getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;

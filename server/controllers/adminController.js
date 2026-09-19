import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get Admin Dashboard KPI Statistics and Charts Data
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = asyncHandler(async (req, res) => {
  // Total Sales & Total Orders
  const orders = await Order.find({});
  const totalOrders = orders.length;

  const totalSales = orders.reduce((acc, order) => {
    return order.orderStatus !== 'Cancelled' ? acc + (order.totalAmount || 0) : acc;
  }, 0);

  // Total Users
  const totalUsers = await User.countDocuments({ role: 'user' });

  // Total Products & Low Stock
  const totalProducts = await Product.countDocuments();
  const lowStockProducts = await Product.find({ stock: { $lte: 15 } })
    .select('name stock price images')
    .limit(10);

  // Status breakdown
  const statusCounts = {
    Pending: 0,
    Confirmed: 0,
    Preparing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  orders.forEach((o) => {
    if (statusCounts[o.orderStatus] !== undefined) {
      statusCounts[o.orderStatus]++;
    }
  });

  // Monthly Sales calculation for the last 6 months
  const monthlySales = [];
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const monthIndex = d.getMonth();

    const monthOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= d && orderDate < nextD && o.orderStatus !== 'Cancelled';
    });

    const monthTotal = monthOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    monthlySales.push({
      month: monthNames[monthIndex],
      year: d.getFullYear(),
      sales: monthTotal,
      orders: monthOrders.length,
    });
  }

  // Recent 6 orders
  const recentOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .populate('user', 'name email');

  res.json({
    kpis: {
      totalSales: Math.round(totalSales * 100) / 100,
      totalOrders,
      totalUsers,
      totalProducts,
      lowStockCount: lowStockProducts.length,
    },
    statusCounts,
    monthlySales,
    lowStockProducts,
    recentOrders,
  });
});

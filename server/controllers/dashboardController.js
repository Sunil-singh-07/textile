import Order from '../models/Order.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/dashboard/buyer  (buyer only)
export const getBuyerDashboard = asyncHandler(async (req, res) => {
  const [recentOrders, orderCount] = await Promise.all([
    Order.find({ buyerId: req.user.id }).sort({ createdAt: -1 }).limit(5),
    Order.countDocuments({ buyerId: req.user.id }),
  ]);

  res.status(200).json({ recentOrders, orderCount });
});

// GET /api/dashboard/supplier  (supplier only)
export const getSupplierDashboard = asyncHandler(async (req, res) => {
  const supplierId = req.user.id;

  const [totalProducts, activeProducts, pendingOrders, recentOrders, lowStockCount] = await Promise.all([
    Product.countDocuments({ supplierId }),
    Product.countDocuments({ supplierId, status: 'available' }),
    Order.countDocuments({ supplierId, status: 'pending' }),
    Order.find({ supplierId }).sort({ createdAt: -1 }).limit(5),
    Product.countDocuments({ supplierId, stock: { $gt: 0, $lte: 5 } }), // "low stock" threshold
  ]);

  res.status(200).json({ totalProducts, activeProducts, pendingOrders, recentOrders, lowStockCount });
});
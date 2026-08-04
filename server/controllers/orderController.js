import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// POST /api/orders  (buyer only)
export const placeOrder = asyncHandler(async (req, res) => {
  const { shippingInfo } = req.body;

  if (!shippingInfo?.name || !shippingInfo?.address || !shippingInfo?.phone) {
    throw new ApiError(400, 'Shipping name, address, and phone are required.', 'VALIDATION_ERROR');
  }

  const cart = await Cart.findOne({ ownerType: 'user', ownerId: req.user.id }).populate('items.productId');

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Your cart is empty.', 'VALIDATION_ERROR');
  }

  // HARD re-check stock here — this is the real check, the one at add-to-cart
  // was only a soft courtesy check. Someone else may have bought the last units since.
  const outOfStockItems = [];
  cart.items.forEach((item) => {
    const product = item.productId;
    if (!product || product.stock < item.quantity) {
      outOfStockItems.push({
        productId: product?._id,
        name: product?.name ?? 'Unknown product',
        available: product?.stock ?? 0,
        requested: item.quantity,
      });
    }
  });

  if (outOfStockItems.length > 0) {
    throw new ApiError(409, 'Some items in your cart are no longer available in the requested quantity.', 'OUT_OF_STOCK');
  }

  // Split cart items by supplier — one Order document per supplier, since a
  // buyer's cart can contain products from multiple suppliers.
  const itemsBySupplier = {};
  cart.items.forEach((item) => {
    const product = item.productId;
    const supplierId = product.supplierId.toString();
    if (!itemsBySupplier[supplierId]) itemsBySupplier[supplierId] = [];
    itemsBySupplier[supplierId].push({
      productId: product._id,
      name: product.name,       // snapshot — survives later product edits
      price: product.price,     // snapshot
      quantity: item.quantity,
    });
  });

  const session = await mongoose.startSession();
  let createdOrders = [];

  try {
    await session.withTransaction(async () => {
      // Decrement stock for every item first, inside the transaction, so a
      // failure partway through rolls back everything instead of leaving
      // half-decremented stock.
     for (const item of cart.items) {
            const product = item.productId;

            const result = await Product.updateOne(
                {
                _id: product._id,
                stock: { $gte: item.quantity }   // only update if enough stock remains
                },
                {
                $inc: { stock: -item.quantity }
                },
                { session }
            );

            if (result.modifiedCount === 0) {
                throw new ApiError(
                409,
                `${product.name} no longer has enough stock.`,
                "OUT_OF_STOCK"
                );
            }

            const updated = await Product.findById(product._id).session(session);

            updated.status =
                updated.stock > 0 ? "available" : "out_of_stock";

            await updated.save({ session });
        }

      const orderDocs = Object.entries(itemsBySupplier).map(([supplierId, items]) => {
        const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        return {
          buyerId: req.user.id,
          supplierId,
          items,
          shippingInfo,
          status: 'pending',
          totalAmount,
        };
      });

      createdOrders = await Order.create(orderDocs, { session });

      cart.items = [];
      await cart.save({ session });
    });
  } finally {
    session.endSession();
  }

  res.status(201).json({ orders: createdOrders });
});

// GET /api/orders/mine  (buyer only)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyerId: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ orders });
});

// GET /api/orders/incoming  (supplier only)
export const getIncomingOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ supplierId: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ orders });
});

// GET /api/orders/:id  (buyer owner or supplier owner)
export const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid order id.', 'VALIDATION_ERROR');
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found.', 'NOT_FOUND');
  }

  const isBuyerOwner = order.buyerId.toString() === req.user.id;
  const isSupplierOwner = order.supplierId.toString() === req.user.id;
  if (!isBuyerOwner && !isSupplierOwner) {
    throw new ApiError(403, 'You do not have access to this order.', 'FORBIDDEN_ROLE');
  }

  res.status(200).json({ order });
});

// PATCH /api/orders/:id/status  (supplier owner only)
const STATUS_SEQUENCE = ['pending', 'accepted', 'preparing', 'ready_for_dispatch', 'completed'];

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!STATUS_SEQUENCE.includes(status)) {
    throw new ApiError(400, `Status must be one of: ${STATUS_SEQUENCE.join(', ')}`, 'VALIDATION_ERROR');
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found.', 'NOT_FOUND');
  }
  if (order.supplierId.toString() !== req.user.id) {
    throw new ApiError(403, 'You can only update your own orders.', 'FORBIDDEN_ROLE');
  }

  const currentIndex = STATUS_SEQUENCE.indexOf(order.status);
  const newIndex = STATUS_SEQUENCE.indexOf(status);

  // Enforce forward-only, one-step-at-a-time progression — no skipping ahead,
  // no reversing. This is the exact rule from the contract.
  if (newIndex !== currentIndex + 1) {
    throw new ApiError(
      400,
      `Cannot move status from "${order.status}" to "${status}". Must follow the sequence in order.`,
      'VALIDATION_ERROR'
    );
  }

  order.status = status;
  await order.save();
  res.status(200).json({ order });
});
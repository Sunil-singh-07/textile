import crypto from 'crypto';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const GUEST_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const resolveOwner = (req, res) => {
  if (req.user) {
    return { ownerType: 'user', ownerId: req.user.id };
  }

  let guestToken = req.cookies?.guestToken;
  if (!guestToken) {
    guestToken = crypto.randomUUID();
    res.cookie('guestToken', guestToken, GUEST_COOKIE_OPTIONS);
  }
  return { ownerType: 'guest', ownerId: guestToken };
};

export const attachUserIfPresent = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // Invalid/expired token on a public route — treat as guest, don't error
  }
  next();
};

const findOrCreateCart = async (owner) => {
  let cart = await Cart.findOne(owner);
  if (!cart) {
    cart = await Cart.create({ ...owner, items: [] });
  }
  return cart;
};

const populatedCart = async (cartId) =>
  Cart.findById(cartId).populate('items.productId', 'name price images stock status');

export const getCart = asyncHandler(async (req, res) => {
  const owner = resolveOwner(req, res);
  const cart = await findOrCreateCart(owner);
  const populated = await populatedCart(cart._id);
  res.status(200).json({ cart: { items: populated.items } });
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, 'A valid productId is required.', 'VALIDATION_ERROR');
  }
  if (!quantity || quantity < 1) {
    throw new ApiError(400, 'Quantity must be at least 1.', 'VALIDATION_ERROR');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found.', 'NOT_FOUND');
  }
  if (product.stock < quantity) {
    throw new ApiError(409, `Only ${product.stock} in stock.`, 'OUT_OF_STOCK');
  }

  const owner = resolveOwner(req, res);
  const cart = await findOrCreateCart(owner);

  const existingItem = cart.items.find((i) => i.productId.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  const populated = await populatedCart(cart._id);
  res.status(200).json({ cart: { items: populated.items } });
});

export const updateItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    throw new ApiError(400, 'Quantity must be at least 1.', 'VALIDATION_ERROR');
  }

  const owner = resolveOwner(req, res);
  const cart = await findOrCreateCart(owner);

  const item = cart.items.find((i) => i.productId.toString() === productId);
  if (!item) {
    throw new ApiError(404, 'Item not found in cart.', 'NOT_FOUND');
  }

  item.quantity = quantity;
  await cart.save();
  const populated = await populatedCart(cart._id);
  res.status(200).json({ cart: { items: populated.items } });
});

export const removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const owner = resolveOwner(req, res);
  const cart = await findOrCreateCart(owner);

  cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

  await cart.save();
  const populated = await populatedCart(cart._id);
  res.status(200).json({ cart: { items: populated.items } });
});
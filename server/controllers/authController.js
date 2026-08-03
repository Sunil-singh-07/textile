import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const signToken = (user) =>
  jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    throw new ApiError(400, 'Email, password, and role are required.', 'VALIDATION_ERROR');
  }
  if (!['buyer', 'supplier'].includes(role)) {
    throw new ApiError(400, 'Role must be either "buyer" or "supplier".', 'VALIDATION_ERROR');
  }
  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters.', 'VALIDATION_ERROR');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists.', 'EMAIL_TAKEN');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email: email.toLowerCase(), passwordHash, role });

  const token = signToken(user);
  res.cookie('token', token, COOKIE_OPTIONS);

  res.status(201).json({ user: { id: user._id, email: user.email, role: user.role } });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.', 'VALIDATION_ERROR');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  // Deliberately identical error for "no user" and "wrong password" — never
  // reveal whether an email is registered.
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
  }

  const token = signToken(user);
  res.cookie('token', token, COOKIE_OPTIONS);

  // Merge guest cart into this user's cart, if a guest cart exists.
  const guestToken = req.cookies?.guestToken;
  if (guestToken) {
    const guestCart = await Cart.findOne({ ownerType: 'guest', ownerId: guestToken });
    if (guestCart && guestCart.items.length > 0) {
      let userCart = await Cart.findOne({ ownerType: 'user', ownerId: user._id.toString() });
      if (!userCart) {
        userCart = await Cart.create({
          ownerType: 'user',
          ownerId: user._id.toString(),
          items: [],
        });
      }

      guestCart.items.forEach((guestItem) => {
        const existingItem = userCart.items.find(
          (i) => i.productId.toString() === guestItem.productId.toString()
        );
        if (existingItem) {
          existingItem.quantity += guestItem.quantity;
        } else {
          userCart.items.push({ productId: guestItem.productId, quantity: guestItem.quantity });
        }
      });

      await userCart.save();
      await guestCart.deleteOne();
    }
    res.clearCookie('guestToken');
  }

  res.status(200).json({ user: { id: user._id, email: user.email, role: user.role } });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.status(200).json({ success: true });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) {
    throw new ApiError(404, 'User not found.', 'NOT_FOUND');
  }
  res.status(200).json({ user: { id: user._id, email: user.email, role: user.role } });
});

import mongoose from 'mongoose';
import SupplierProfile from '../models/SupplierProfile.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/suppliers/:id  (public — safe fields only, NOT contactInfo/address)
export const getPublicSupplierProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid supplier id.', 'VALIDATION_ERROR');
  }

  const profile = await SupplierProfile.findOne({ userId: id }).select(
    'businessName categories fabricTypes moq'
  );
  if (!profile) {
    throw new ApiError(404, 'Supplier not found.', 'NOT_FOUND');
  }

  res.status(200).json({ profile });
});

// GET /api/suppliers/me  (supplier only, full profile)
export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await SupplierProfile.findOne({ userId: req.user.id });
  if (!profile) {
    throw new ApiError(404, 'Profile not found. Please complete onboarding first.', 'NOT_FOUND');
  }
  res.status(200).json({ profile });
});

// PUT /api/suppliers/me  (supplier only)
export const updateMyProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'businessName', 'businessType', 'contactInfo',
    'address', 'operatingHours', 'categories', 'fabricTypes', 'moq',
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const profile = await SupplierProfile.findOneAndUpdate(
    { userId: req.user.id },
    updates,
    { new: true, runValidators: true }
  );

  if (!profile) {
    throw new ApiError(404, 'Profile not found. Please complete onboarding first.', 'NOT_FOUND');
  }

  res.status(200).json({ profile });
});
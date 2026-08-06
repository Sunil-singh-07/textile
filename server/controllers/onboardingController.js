import BuyerProfile from '../models/BuyerProfile.js';
import SupplierProfile from '../models/SupplierProfile.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// POST /api/onboarding/buyer  (buyer only)
export const submitBuyerOnboarding = asyncHandler(async (req, res) => {
  const {
    businessType,
    industry,
    categoriesOfInterest,
    fabricPreferences,
    typicalOrderQty,
    budgetRange,
  } = req.body;

  // Upsert — supports both first-time onboarding and later edits through the
  // same endpoint, so the frontend doesn't need two different code paths.
  const profile = await BuyerProfile.findOneAndUpdate(
    { userId: req.user.id },
    {
      userId: req.user.id,
      businessType,
      industry,
      categoriesOfInterest,
      fabricPreferences,
      typicalOrderQty,
      budgetRange,
      onboardingComplete: true,
    },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({ profile });
});

// POST /api/onboarding/supplier  (supplier only)
export const submitSupplierOnboarding = asyncHandler(async (req, res) => {
  const {
    businessName,
    businessType,
    contactInfo,
    address,
    operatingHours,
    categories,
    fabricTypes,
    moq,
  } = req.body;

  if (!businessName) {
    throw new ApiError(400, 'Business name is required.', 'VALIDATION_ERROR');
  }

  const profile = await SupplierProfile.findOneAndUpdate(
    { userId: req.user.id },
    {
      userId: req.user.id,
      businessName,
      businessType,
      contactInfo,
      address,
      operatingHours,
      categories,
      fabricTypes,
      moq,
      onboardingComplete: true,
    },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({ profile });
});
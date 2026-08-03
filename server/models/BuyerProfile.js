import mongoose from 'mongoose';

const buyerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessType: { type: String, default: '' },
    industry: { type: String, default: '' },
    categoriesOfInterest: { type: [String], default: [] },
    fabricPreferences: { type: [String], default: [] },
    typicalOrderQty: { type: String, default: '' },
    budgetRange: { type: String, default: '' },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const BuyerProfile = mongoose.model('BuyerProfile', buyerProfileSchema);
export default BuyerProfile;

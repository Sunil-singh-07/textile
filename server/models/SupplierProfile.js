import mongoose from 'mongoose';

const supplierProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessName: { type: String, required: [true, 'Business name is required'] },
    businessType: { type: String, default: '' },
    contactInfo: {
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      postalCode: { type: String, default: '' },
    },
    operatingHours: { type: String, default: '' },
    categories: { type: [String], default: [] },
    fabricTypes: { type: [String], default: [] },
    moq: { type: String, default: '' },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SupplierProfile = mongoose.model('SupplierProfile', supplierProfileSchema);
export default SupplierProfile;
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
      contactEmail: { type: String, default: '' },
    },
    address: { type: String, default: '' },
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

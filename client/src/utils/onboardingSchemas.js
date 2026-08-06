import { z } from 'zod';
import { POPULAR_CATEGORIES } from './mockLandingData';

// Reuse the same category taxonomy the marketplace filters use (see
// SupplierProductsPage.jsx's CATEGORY_NAMES) so a buyer's "categories of
// interest" and a supplier's "categories" line up with real product data.
export const CATEGORY_OPTIONS = POPULAR_CATEGORIES.map((c) => c.name);

// No existing fabric-type taxonomy exists elsewhere in the app (Product
// only has free-text `specs.composition`), so this is a new, self-contained
// option list — distinct from CATEGORY_OPTIONS, which describes fibre
// rather than weave/construction.
export const FABRIC_TYPE_OPTIONS = [
  'Twill',
  'Poplin',
  'Chambray',
  'Jersey Knit',
  'Canvas',
  'Satin',
  'Chiffon',
  'Corduroy',
  'Fleece',
  'Voile',
];

export const BUSINESS_TYPE_OPTIONS_BUYER = [
  'Retailer',
  'Wholesaler',
  'Manufacturer',
  'Boutique',
  'E-commerce Brand',
  'Other',
];

export const INDUSTRY_OPTIONS = [
  'Apparel',
  'Home Textiles',
  'Fashion Accessories',
  'Upholstery',
  'Industrial Textiles',
  'Other',
];

export const ORDER_QTY_OPTIONS = [
  '1 - 50 units',
  '51 - 200 units',
  '201 - 500 units',
  '501 - 2,000 units',
  '2,000+ units',
];

export const BUDGET_RANGE_OPTIONS = [
  'Under \u20b950,000',
  '\u20b950,000 - \u20b92,00,000',
  '\u20b92,00,000 - \u20b95,00,000',
  '\u20b95,00,000 - \u20b915,00,000',
  '\u20b915,00,000+',
];

export const BUSINESS_TYPE_OPTIONS_SUPPLIER = [
  'Manufacturer',
  'Mill',
  'Wholesaler',
  'Exporter',
  'Trading Company',
  'Other',
];

export const MOQ_OPTIONS = [
  'Under 100 metres',
  '100 - 500 metres',
  '500 - 2,000 metres',
  '2,000+ metres',
];

// Mirrors every field submitBuyerOnboarding reads from req.body
// (server/controllers/onboardingController.js). categoriesOfInterest and
// fabricPreferences require at least one selection — an empty preference
// set would defeat the point of onboarding.
export const buyerOnboardingSchema = z.object({
  businessType: z.string().min(1, 'Select a business type'),
  industry: z.string().min(1, 'Select an industry'),
  categoriesOfInterest: z.array(z.string()).min(1, 'Select at least one category'),
  fabricPreferences: z.array(z.string()).min(1, 'Select at least one fabric type'),
  typicalOrderQty: z.string().min(1, 'Select a typical order quantity'),
  budgetRange: z.string().min(1, 'Select a budget range'),
});

// Mirrors every field submitSupplierOnboarding reads from req.body. Only
// businessName is required backend-side, but every field here is a listed
// requirement for this feature, so all are required client-side too.
export const supplierOnboardingSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessType: z.string().min(1, 'Select a business type'),
  contactInfo: z.object({
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  }),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
  operatingHours: z.string().min(1, 'Operating hours are required'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  fabricTypes: z.array(z.string()).min(1, 'Select at least one fabric type'),
  moq: z.string().min(1, 'Select a minimum order quantity'),
});
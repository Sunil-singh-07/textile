// Placeholder data only — shaped to match the real Product model
// (name, category, price, specs{gsm,width,composition}, colors[], stock,
// status) so swapping this for a real GET /products response in Phase 3
// requires no ProductCard changes. `supplierName` is a display-only extra.
export const FEATURED_PRODUCTS = [
  {
    _id: 'mock-1',
    name: 'Brushed Cotton Twill',
    category: 'Cotton',
    price: 289,
    specs: { gsm: 280, width: '58"', composition: '100% Cotton' },
    colors: ['#6B4F3B', '#B08968', '#2F241D', '#D3B599'],
    stock: 4200,
    status: 'available',
    supplierName: 'Anandi Textile Mills',
  },
  {
    _id: 'mock-2',
    name: 'Belgian Linen Blend',
    category: 'Linen',
    price: 512,
    specs: { gsm: 210, width: '54"', composition: '70% Linen / 30% Cotton' },
    colors: ['#F3E7DA', '#8C6A52', '#7A6C5D'],
    stock: 1800,
    status: 'available',
    supplierName: 'Coastal Weaves Co.',
  },
  {
    _id: 'mock-3',
    name: 'Merino Wool Suiting',
    category: 'Wool',
    price: 940,
    specs: { gsm: 320, width: '60"', composition: '100% Merino Wool' },
    colors: ['#2F241D', '#463327', '#6B4F3B'],
    stock: 0,
    status: 'out_of_stock',
    supplierName: 'Himalayan Fibre House',
  },
  {
    _id: 'mock-4',
    name: 'Washed Denim 12oz',
    category: 'Denim',
    price: 375,
    specs: { gsm: 400, width: '62"', composition: '98% Cotton / 2% Elastane' },
    colors: ['#3B4A5C', '#2F241D'],
    stock: 6100,
    status: 'available',
    supplierName: 'Indigo Mills Ltd.',
  },
  {
    _id: 'mock-5',
    name: 'Mulberry Silk Charmeuse',
    category: 'Silk',
    price: 1180,
    specs: { gsm: 90, width: '44"', composition: '100% Mulberry Silk' },
    colors: ['#B08968', '#D3B599', '#F3E7DA'],
    stock: 950,
    status: 'available',
    supplierName: 'Varanasi Silk Exports',
  },
  {
    _id: 'mock-6',
    name: 'Recycled Poly-Cotton Blend',
    category: 'Blends',
    price: 198,
    specs: { gsm: 240, width: '58"', composition: '55% Recycled Poly / 45% Cotton' },
    colors: ['#8C6A52', '#55704F', '#2F241D'],
    stock: 3400,
    status: 'available',
    supplierName: 'GreenLoom Fabrics',
  },
];

export const POPULAR_CATEGORIES = [
  { name: 'Cotton', tint: '#6B4F3B', count: '3,200+ SKUs' },
  { name: 'Linen', tint: '#8C6A52', count: '980+ SKUs' },
  { name: 'Wool', tint: '#463327', count: '640+ SKUs' },
  { name: 'Silk', tint: '#B08968', count: '410+ SKUs' },
  { name: 'Denim', tint: '#3B4A5C', count: '1,150+ SKUs' },
  { name: 'Blends', tint: '#55704F', count: '2,050+ SKUs' },
];

export const TESTIMONIALS = [
  {
    quote:
      "We used to spend days chasing suppliers for a single swatch. The AI assistant matched us with three verified mills for our GSM spec in under an hour.",
    name: 'Priya Nathan',
    role: 'Procurement Lead, Meridian Garments',
  },
  {
    quote:
      'Listing our fabric catalogue took an afternoon, and we had our first inbound order from a buyer we would never have reached otherwise.',
    name: 'Farooq Ahsan',
    role: 'Director, Indigo Mills Ltd.',
  },
  {
    quote:
      "Order status updates that actually reflect the production floor — no more guessing where a bulk order stands.",
    name: 'Lena Ostrowski',
    role: 'Sourcing Manager, Nordholt Apparel',
  },
];

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    category: { type: String, required: [true, 'Category is required'] },
    description: { type: String, default: '' },
    colors: { type: [String], default: [] },
    specs: {
      gsm: { type: Number },
      width: { type: String },
      composition: { type: String },
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    status: {
      type: String,
      enum: ['available', 'out_of_stock'],
      default: 'available',
    },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Keep status in sync with stock automatically — this is the single source of
// truth so nobody has to remember to set status manually when editing stock.
productSchema.pre('save', function (next) {
  this.status = this.stock > 0 ? 'available' : 'out_of_stock';
  next();
});

// Text index for the /products?search= query
productSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;

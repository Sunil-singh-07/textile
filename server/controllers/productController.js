import mongoose from 'mongoose';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const listProducts = asyncHandler(async (req, res) => {
  const { category, search, minPrice, maxPrice, color, supplierId, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (color) filter.colors = color;
  if (search) filter.$text = { $search: search };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  // Optional — lets a supplier fetch just their own catalog (e.g. "My
  // Products"). Omitted entirely means unfiltered by supplier, exactly as
  // before, so the public marketplace listing is untouched.
  if (supplierId) {
    if (!mongoose.isValidObjectId(supplierId)) {
      throw new ApiError(400, 'Invalid supplier id.', 'VALIDATION_ERROR');
    }
    filter.supplierId = supplierId;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({ products, total, page: pageNum });
});

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid product id.', 'VALIDATION_ERROR');
  }
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found.', 'NOT_FOUND');
  }
  res.status(200).json({ product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, category, description, colors, specs, price, stock, images } = req.body;

  if (!name || !category) {
    throw new ApiError(400, 'Name and category are required.', 'VALIDATION_ERROR');
  }
  if (price === undefined || price < 0) {
    throw new ApiError(400, 'Price must be a non-negative number.', 'VALIDATION_ERROR');
  }
  if (stock === undefined || stock < 0) {
    throw new ApiError(400, 'Stock must be a non-negative number.', 'VALIDATION_ERROR');
  }

  const product = await Product.create({
    supplierId: req.user.id,
    name, category, description, colors, specs, price, stock, images,
  });

  res.status(201).json({ product });
});

const getOwnedProductOr403 = async (productId, userId) => {
  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, 'Invalid product id.', 'VALIDATION_ERROR');
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found.', 'NOT_FOUND');
  }
  if (product.supplierId.toString() !== userId) {
    throw new ApiError(403, 'You can only modify your own products.', 'FORBIDDEN_ROLE');
  }
  return product;
};

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await getOwnedProductOr403(req.params.id, req.user.id);
  const allowedFields = ['name', 'category', 'description', 'colors', 'specs', 'price', 'stock', 'images'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });
  if (product.price < 0) throw new ApiError(400, 'Price cannot be negative.', 'VALIDATION_ERROR');
  if (product.stock < 0) throw new ApiError(400, 'Stock cannot be negative.', 'VALIDATION_ERROR');
  await product.save();
  res.status(200).json({ product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await getOwnedProductOr403(req.params.id, req.user.id);
  await product.deleteOne();
  res.status(200).json({ success: true });
});

export const updateStock = asyncHandler(async (req, res) => {
  const { stock } = req.body;
  if (stock === undefined || stock < 0) {
    throw new ApiError(400, 'Stock must be a non-negative number.', 'VALIDATION_ERROR');
  }
  const product = await getOwnedProductOr403(req.params.id, req.user.id);
  product.stock = stock;
  await product.save();
  res.status(200).json({ product });
});
import { z } from 'zod';

// Mirrors server/controllers/productController.js (createProduct/updateProduct)
// and server/models/Product.js exactly: name + category required, price and
// stock required non-negative numbers — nothing more — so a client-side
// rejection never says something the backend would disagree with.
//
// colors/images are edited as comma-separated text in the form (there's no
// multi-value input or file upload elsewhere in this app to reuse), then
// split into arrays here. specs.* are individually optional, matching the
// Product model where the whole `specs` sub-document is optional.
const commaListToArray = (value) =>
  (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const productFormSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required'),
  category: z.string().trim().min(1, 'Category is required'),
  description: z.string().trim().optional(),
  price: z.coerce.number({ invalid_type_error: 'Price is required' }).min(0, 'Price cannot be negative'),
  stock: z.coerce.number({ invalid_type_error: 'Stock is required' }).min(0, 'Stock cannot be negative'),
  colors: z.string().trim().optional(),
  images: z.string().trim().optional(),
  gsm: z.union([z.coerce.number().min(0, 'GSM cannot be negative'), z.literal('')]).optional(),
  width: z.string().trim().optional(),
  composition: z.string().trim().optional(),
});

// Converts validated form values into the exact payload shape the backend
// accepts (colors[]/images[] arrays, nested specs object, numeric price/stock).
export const toProductPayload = (values) => ({
  name: values.name,
  category: values.category,
  description: values.description || '',
  price: values.price,
  stock: values.stock,
  colors: commaListToArray(values.colors),
  images: commaListToArray(values.images),
  specs: {
    gsm: values.gsm === '' || values.gsm === undefined ? undefined : values.gsm,
    width: values.width || undefined,
    composition: values.composition || undefined,
  },
});

// Converts an existing product (from the API) into form default values.
export const productToFormValues = (product) => ({
  name: product?.name ?? '',
  category: product?.category ?? '',
  description: product?.description ?? '',
  price: product?.price ?? 0,
  stock: product?.stock ?? 0,
  colors: (product?.colors ?? []).join(', '),
  images: (product?.images ?? []).join(', '),
  gsm: product?.specs?.gsm ?? '',
  width: product?.specs?.width ?? '',
  composition: product?.specs?.composition ?? '',
});

import axiosClient from './axiosClient';

// Maps 1:1 to server/routes/productRoutes.js.
export const productApi = {
  // GET /products?category&search&minPrice&maxPrice&color&page&limit
  // -> { products, total, page }  (no totalPages/limit echoed back — the
  // caller must compute pages itself from `total` and the `limit` it sent).
  list: (params = {}) => axiosClient.get('/products', { params }).then((res) => res.data),

  // -> { product }
  getById: (id) => axiosClient.get(`/products/${id}`).then((res) => res.data),

  // supplier only. Never send `status` — it's server-derived from stock.
  create: (payload) => axiosClient.post('/products', payload).then((res) => res.data),

  // supplier + owner only (403 otherwise)
  update: (id, payload) => axiosClient.put(`/products/${id}`, payload).then((res) => res.data),

  // supplier + owner only -> { success: true }
  remove: (id) => axiosClient.delete(`/products/${id}`).then((res) => res.data),

  // supplier + owner only, PATCH /products/:id/stock { stock }
  updateStock: (id, stock) =>
    axiosClient.patch(`/products/${id}/stock`, { stock }).then((res) => res.data),
};

import axiosClient from './axiosClient';

// Maps 1:1 to server/routes/cartRoutes.js.
// Every route here is public but auth-aware: it works identically for a
// logged-out guest (via an auto-issued `guestToken` cookie) and a logged-in
// user. Never gate cart calls behind isAuthenticated.
// Every response is { cart: { items: [{ productId: { name, price, images,
// stock, status }, quantity }] } } — productId is populated, not a bare id.
export const cartApi = {
  get: () => axiosClient.get('/cart').then((res) => res.data),

  addItem: (productId, quantity) =>
    axiosClient.post('/cart/items', { productId, quantity }).then((res) => res.data),

  updateItem: (productId, quantity) =>
    axiosClient.put(`/cart/items/${productId}`, { quantity }).then((res) => res.data),

  removeItem: (productId) =>
    axiosClient.delete(`/cart/items/${productId}`).then((res) => res.data),
};

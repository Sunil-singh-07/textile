import axiosClient from './axiosClient';

// Maps 1:1 to server/routes/orderRoutes.js.
export const orderApi = {
  // buyer only. Body is cart-based — no line items, the backend reads the
  // buyer's current cart server-side. Splits into one Order per supplier,
  // so the response is a plural array even for a single-supplier checkout.
  // -> { orders: [...] }
  place: (shippingInfo) =>
    axiosClient.post('/orders', { shippingInfo }).then((res) => res.data),

  // buyer only -> { orders }
  mine: () => axiosClient.get('/orders/mine').then((res) => res.data),

  // supplier only -> { orders }
  incoming: () => axiosClient.get('/orders/incoming').then((res) => res.data),

  // either the buyer owner or the supplier owner -> { order }
  getById: (id) => axiosClient.get(`/orders/${id}`).then((res) => res.data),

  // supplier + owner only. `status` must be exactly the next value in
  // ORDER_STATUS_SEQUENCE (see utils/constants.js / getNextOrderStatus) —
  // the backend rejects any skip or reversal with 400 VALIDATION_ERROR.
  updateStatus: (id, status) =>
    axiosClient.patch(`/orders/${id}/status`, { status }).then((res) => res.data),
};

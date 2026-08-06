// Every value here is copied directly from the backend contract (models +
// controllers) — do not add values the API doesn't actually support.

export const ROLES = {
  BUYER: 'buyer',
  SUPPLIER: 'supplier',
};

// Order status machine — from server/controllers/orderController.js
// (STATUS_SEQUENCE). Transitions are strictly forward, one step at a time,
// and only the supplier who owns the order can advance it.
export const ORDER_STATUS_SEQUENCE = [
  'pending',
  'accepted',
  'preparing',
  'ready_for_dispatch',
  'completed',
];

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready_for_dispatch: 'Ready for Dispatch',
  completed: 'Completed',
};

// Returns the single next allowed status, or null if the order is already
// at the end of the sequence. The status-update UI should only ever offer
// this value — never a free picker — since the backend rejects anything else.
export const getNextOrderStatus = (currentStatus) => {
  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === ORDER_STATUS_SEQUENCE.length - 1) return null;
  return ORDER_STATUS_SEQUENCE[currentIndex + 1];
};

// Product.status is server-derived (pre-save hook on stock) — never sent
// from the frontend, only ever read.
export const PRODUCT_STATUS = {
  AVAILABLE: 'available',
  OUT_OF_STOCK: 'out_of_stock',
};

// Product listing defaults — from productController.listProducts.
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

// Error codes the backend's global errorHandler.js can return, verbatim.
export const API_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EMAIL_TAKEN: 'EMAIL_TAKEN',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN_ROLE: 'FORBIDDEN_ROLE',
  NOT_FOUND: 'NOT_FOUND',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SERVER_ERROR: 'SERVER_ERROR',
};

export const ROLE_HOME_ROUTE = {
  [ROLES.BUYER]: '/buyer/dashboard',
  [ROLES.SUPPLIER]: '/supplier/dashboard',
};

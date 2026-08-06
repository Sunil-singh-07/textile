import axiosClient from './axiosClient';

// Maps 1:1 to server/routes/dashboardRoutes.js.
export const dashboardApi = {
  // buyer only -> { recentOrders (max 5), orderCount }
  buyer: () => axiosClient.get('/dashboard/buyer').then((res) => res.data),

  // supplier only -> { totalProducts, activeProducts, pendingOrders, recentOrders (max 5), lowStockCount }
  supplier: () => axiosClient.get('/dashboard/supplier').then((res) => res.data),
};

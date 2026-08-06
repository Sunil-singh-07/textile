import axiosClient from './axiosClient';

// Maps 1:1 to server/routes/supplierRoutes.js.
export const supplierApi = {
  // public — only safe fields: businessName, categories, fabricTypes, moq.
  // No contactInfo/address here by design (that's supplier-only via /me).
  // -> { profile }
  getPublicProfile: (id) => axiosClient.get(`/suppliers/${id}`).then((res) => res.data),

  // supplier only, full profile. 404s if onboarding hasn't been completed yet.
  // -> { profile }
  getMyProfile: () => axiosClient.get('/suppliers/me').then((res) => res.data),

  // supplier only, partial update (any subset of allowed fields) -> { profile }
  updateMyProfile: (payload) => axiosClient.put('/suppliers/me', payload).then((res) => res.data),
};

import axiosClient from './axiosClient';

// Maps 1:1 to server/routes/authRoutes.js. All responses are { user: { id, email, role } }
// except logout, which is { success: true }.
export const authApi = {
  register: (payload) => axiosClient.post('/auth/register', payload).then((res) => res.data),

  login: (payload) => axiosClient.post('/auth/login', payload).then((res) => res.data),

  logout: () => axiosClient.post('/auth/logout').then((res) => res.data),

  // Silent on failure — a 401 here just means "not logged in yet", used for
  // hydrating auth state on app load, not a real error to toast.
  getMe: () =>
    axiosClient.get('/auth/me', { skipErrorToast: true }).then((res) => res.data),
};

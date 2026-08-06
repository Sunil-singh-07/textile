import axios from 'axios';
import { toast } from 'sonner';
import { emitUnauthorized } from '../utils/authEvents';
import { API_ERROR_CODES } from '../utils/constants';

// The backend authenticates purely via an httpOnly `token` cookie (see
// server/middleware/auth.js) — there is no Authorization header scheme in
// this API. `withCredentials: true` is what makes the browser send/receive
// that cookie (and the `guestToken` cookie used by cart/AI routes) cross-origin.
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Every backend error funnels through middleware/errorHandler.js into the
// exact same shape: { error: true, message, code }. We normalize to that
// shape here so every caller in the app can rely on err.message / err.code
// regardless of where the request came from.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    const message =
      data?.message ||
      (error.code === 'ERR_NETWORK'
        ? 'Could not reach the server. Check your connection and try again.'
        : 'Something went wrong. Please try again.');
    const code = data?.code || 'NETWORK_ERROR';

    // A stale/invalid session cookie — let AuthContext know so it can clear
    // the logged-in user and let route guards redirect naturally.
    if (status === 401 && code === API_ERROR_CODES.UNAUTHORIZED) {
      emitUnauthorized();
    }

    // Individual requests can opt out (e.g. the silent /auth/me hydration
    // check on app load, where a 401 just means "not logged in" and isn't
    // an error worth surfacing to the user).
    const skipErrorToast = error.config?.skipErrorToast;
    if (!skipErrorToast) {
      toast.error(message);
    }

    return Promise.reject({ status, message, code, raw: error });
  }
);

export default axiosClient;

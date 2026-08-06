// The axios client needs to react to a 401 (clear the logged-in user) without
// importing AuthContext directly — that would create a circular import
// (context -> api -> axiosClient -> context). This tiny pub/sub decouples them.
const listeners = new Set();

export const onUnauthorized = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

export const emitUnauthorized = () => {
  listeners.forEach((callback) => callback());
};

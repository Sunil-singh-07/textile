// Wrap async route handlers so any thrown/rejected error is forwarded to
// Express's error-handling middleware instead of crashing the process or
// hanging the request. This is a big part of "don't break on edge cases."
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;

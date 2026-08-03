import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

// Reads the `token` httpOnly cookie, verifies it, and attaches the decoded
// payload to req.user. Any route behind this middleware is guaranteed to
// have a valid, logged-in user by the time the controller runs.
export const requireAuth = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new ApiError(401, 'You must be logged in to do this.', 'UNAUTHORIZED'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    // Covers both expired and malformed/tampered tokens — same response either way.
    return next(new ApiError(401, 'Your session has expired. Please log in again.', 'UNAUTHORIZED'));
  }
};

// Usage: requireRole('supplier') or requireRole('buyer')
// Must be used AFTER requireAuth in the middleware chain.
export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    // Defensive check — should never trigger if requireAuth ran first, but
    // fails safe rather than assuming.
    return next(new ApiError(401, 'You must be logged in to do this.', 'UNAUTHORIZED'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(
      new ApiError(403, `This action requires ${allowedRoles.join(' or ')} access.`, 'FORBIDDEN_ROLE')
    );
  }

  next();
};

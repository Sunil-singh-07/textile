import ApiError from '../utils/ApiError.js';

// This is the LAST middleware in the stack (registered after all routes in server.js).
// Every error in the app funnels here — this is what guarantees the API never
// sends a raw stack trace or an inconsistent error shape to the frontend.
const errorHandler = (err, req, res, next) => {
  // Mongoose validation errors -> normalize to our VALIDATION_ERROR shape
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: true,
      message: Object.values(err.errors).map((e) => e.message).join(', '),
      code: 'VALIDATION_ERROR',
    });
  }

  // Mongoose duplicate key error (e.g. duplicate email on register)
  if (err.code === 11000) {
    return res.status(409).json({
      error: true,
      message: 'A record with this value already exists.',
      code: 'EMAIL_TAKEN',
    });
  }

  // Malformed ObjectId cast errors (e.g. /products/not-a-valid-id)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: true,
      message: `Invalid identifier: ${err.value}`,
      code: 'VALIDATION_ERROR',
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: true,
      message: err.message,
      code: err.code,
    });
  }

  // Anything unexpected — log server-side for debugging, but never leak
  // internals to the client.
  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: true,
    message: 'Something went wrong on our end.',
    code: 'SERVER_ERROR',
  });
};

export default errorHandler;

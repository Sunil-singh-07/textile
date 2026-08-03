// Every thrown error in this app should be an ApiError so the error handler
// can always produce the exact { error, message, code } shape from the contract.
class ApiError extends Error {
  constructor(statusCode, message, code = 'SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export default ApiError;

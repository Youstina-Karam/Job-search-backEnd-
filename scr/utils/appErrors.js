export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 400;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // to distinguish between operational and programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}
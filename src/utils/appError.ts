export default class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    // Maintains proper stack trace (only in V8 engines)
    Error.captureStackTrace(this, this.constructor);
  }
}

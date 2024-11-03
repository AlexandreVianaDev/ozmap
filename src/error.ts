export class AppError extends Error {
  statusCode: number;
  errorCode: string;
  constructor(message: string, errorCode: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

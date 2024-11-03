export class AppError extends Error {
  statusCode: number;
  errorCode: string;
  details: object;
  constructor(
    message: string,
    errorCode: string,
    statusCode: number = 400,
    details: object = {},
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

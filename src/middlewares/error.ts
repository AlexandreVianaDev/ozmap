import { NextFunction, Request, Response } from "express";
import { AppError } from "../error";
import STATUS from "../constants/status";

const pino = require("pino");
const logger = pino({ level: "info" });

const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): any | void => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  logger.error(err);
  return res
    .status(STATUS.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal Server Error." });
};

export default errorHandlerMiddleware;

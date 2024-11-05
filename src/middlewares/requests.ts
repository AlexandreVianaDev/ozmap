import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { AppError } from "../error";
import STATUS from "../constants/status";

class RequestsMiddlewares {
  public validateBodyMiddleware =
    (schema: ZodTypeAny) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = schema.parse(req.body);
      } catch (err) {
        throw new AppError(
          "Erro de validação do corpo da requisição",
          "VALIDATION_ERROR",
          STATUS.BAD_REQUEST,
          err.issues,
        );
      }

      return next();
    };

  public validateQueryParamsMiddleware =
    (schema: ZodTypeAny) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        req.query = schema.parse(req.query);
      } catch (err) {
        throw new AppError(
          "Erro de validação do corpo da requisição",
          "VALIDATION_ERROR",
          STATUS.BAD_REQUEST,
          err.issues,
        );
      }

      return next();
    };
}

export default RequestsMiddlewares;

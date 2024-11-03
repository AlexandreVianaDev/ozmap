import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/models";
import { AppError } from "../error";
import STATUS from "../constants/status";

class UsersMiddlewares {
  public userExists = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    const { id } = req.params;

    const user = await UserModel.findOne({ _id: id });

    if (!user) {
      throw new AppError(
        "Usuário não encontrado",
        "USER_NOT_FOUND",
        STATUS.NOT_FOUND,
      );
    }

    next();
  };

  public userAddressOrCoordinates = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { body } = req;
    const methodKey =
      req.method === "POST" ? "create" : req.method === "PUT" ? "update" : null;

    let address: string | undefined;
    let coordinates: number[] | undefined;

    if (methodKey) {
      address = body[methodKey]?.address;
      coordinates = body[methodKey]?.coordinates;
    }

    if (address && coordinates) {
      throw new AppError(
        "Envie somente endereço ou coordenadas.",
        "BAD_REQUEST",
        STATUS.BAD_REQUEST,
      );
    }

    if (!address && !coordinates) {
      throw new AppError(
        "Envie o endereço ou as coordenadas.",
        "BAD_REQUEST",
        STATUS.BAD_REQUEST,
      );
    }

    next();
  };
}

export default UsersMiddlewares;

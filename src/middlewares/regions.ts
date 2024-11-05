import { NextFunction, Request, Response } from "express";
import { AppError } from "../error";
import STATUS from "../constants/status";
import { RegionModel } from "../models/models";

class RegionsMiddlewares {
  public regionExists = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let { id } = req.params;

    const region = await RegionModel.findOne({ _id: id });

    if (!region) {
      throw new AppError(
        "Região não encontrada",
        "REGION_NOT_FOUND",
        STATUS.NOT_FOUND,
      );
    }

    next();
  };
}

export default RegionsMiddlewares;

import { Request, Response } from "express";
import RegionsServices from "../services/regions";
import STATUS from "../constants/status";
import { IGetRegions } from "../interfaces/regions";

class RegionsControllers {
  regionsServices = new RegionsServices();

  public getRegions = async (
    req: Request<IGetRegions>,
    res: Response,
  ): Promise<any> => {
    const { lng, lat } = req.query;

    const regions = await this.regionsServices.getRegions(
      lat as string,
      lng as string,
    );

    return res.status(STATUS.OK).json({
      regions: regions,
    });
  };

  public getRegionsNear = async (
    req: Request<IGetRegions>,
    res: Response,
  ): Promise<any> => {
    const { lat, lng, distance, user } = req.query;

    const regions = await this.regionsServices.getRegionsNear(
      lat as string,
      lng as string,
      distance as string,
      user as string,
    );

    return res.status(STATUS.OK).json({
      regions: regions,
    });
  };

  public createRegion = async (req: Request, res: Response): Promise<any> => {
    const { create } = req.body;

    const region = await this.regionsServices.createRegion(create);

    return res.status(STATUS.CREATED).json({
      region: region,
    });
  };

  public updateRegion = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { update } = req.body;

    const region = await this.regionsServices.updateRegion(id, update);

    return res.status(STATUS.UPDATED).json({
      success: true,
      region: region,
    });
  };

  public deleteRegion = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    await this.regionsServices.deleteRegion(id);

    return res.status(STATUS.OK).json({
      success: true,
    });
  };
}

export default RegionsControllers;

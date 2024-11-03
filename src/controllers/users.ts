import { Request, Response } from "express";
import UsersServices from "../services/users";
import STATUS from "../constants/status";
import { IGetUsers } from "../interfaces/users";

class UsersControllers {
  userServices = new UsersServices();

  public getUsers = async (
    req: Request<{}, {}, {}, IGetUsers>,
    res: Response,
  ) => {
    const { page, limit } = req.query;

    const users = await this.userServices.getUsers(page, limit);

    res.json({
      users: users,
    });
  };

  public getUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await this.userServices.getUser(id);

    res.json({
      user: user,
    });
  };

  public updateUser = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { update } = req.body;

    const user = await this.userServices.updateUser(id, update);

    res.status(STATUS.UPDATED).json({
      success: true,
      user: user,
    });
  };

  public createUser = async (req: Request, res: Response): Promise<any> => {
    const { create } = req.body;

    const user = await this.userServices.createUser(create);

    return res.status(STATUS.CREATED).json({
      user: user,
    });
  };

  public deleteUser = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    await this.userServices.deleteUser(id);

    return res.status(STATUS.OK).json({
      success: true,
    });
  };
}

export default UsersControllers;

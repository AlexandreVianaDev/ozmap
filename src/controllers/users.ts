import { Request, RequestHandler, Response } from "express";
import UsersServices from "../services/users";
import STATUS from "../constants/status";

class UsersControllers {
  userServices = new UsersServices();

  public getUsers: RequestHandler = async (req: Request, res: Response) => {
    const users = await this.userServices.getUsers(req);

    res.json({
      users: users,
    });
  };

  public getUser: RequestHandler = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { id } = req.params;

    const user = await this.userServices.getUser(id);

    res.json();
  };

  public updateUser: RequestHandler = async (
    req: Request,
    res: Response,
  ): Promise<any> => {
    const { id } = req.params;
    const { update } = req.body;

    const user = await this.userServices.updateUser(id, update);

    res.status(STATUS.UPDATED).json({
      user: user,
    });
  };

  public createUser: RequestHandler = async (
    req: Request,
    res: Response,
  ): Promise<any> => {
    const { create } = req.body;

    const user = await this.userServices.createUser(create);

    return res.status(STATUS.CREATED).json({
      user: user,
    });
  };

  public deleteUser: RequestHandler = async (
    req: Request,
    res: Response,
  ): Promise<any> => {
    const { id } = req.params;

    await this.userServices.deleteUser(id);

    return res.status(STATUS.OK).json({
      success: true,
    });
  };
}

export default UsersControllers;

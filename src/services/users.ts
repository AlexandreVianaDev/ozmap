import { Request } from "express";
import { UserModel } from "../models/models";
import { IGetUsers, IUser } from "../interfaces/users";

class UsersServices {
  public getUsers = async (req: Request): Promise<IGetUsers> => {
    const { page, limit } = req.query;

    const pageValue = page as string | undefined;
    const limitValue = limit as string | undefined;

    const [users, total] = await Promise.all([
      UserModel.find().lean(),
      UserModel.count(),
    ]);

    return {
      rows: users,
      pageValue,
      limitValue,
      total,
    };
  };

  public getUser = async (id: string) => {
    const user = await UserModel.findOne({ _id: id }).lean();
    return user;
  };

  public updateUser = async (id: string, update: IUser) => {
    const user = await UserModel.findOne({ _id: id });

    if (user) {
      user.name = update.name;
      user.email = update.email;
      if (update.address) user.address = update.address;
      if (update.coordinates) user.coordinates = update.coordinates;

      await user.save();
    }

    return user.toObject();
  };

  public createUser = async (create: IUser) => {
    const user = new UserModel(create);
    const savedUser = user.save();
    return savedUser;
  };

  public deleteUser = async (id: string) => {
    await UserModel.deleteOne({ _id: id });
  };
}

export default UsersServices;

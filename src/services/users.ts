import { UserModel } from "../models/models";
import { IGetUsers, IUser } from "../interfaces/users";

class UsersServices {
  public getUsers = async (page: string, limit: string): Promise<IGetUsers> => {
    const [users, total] = await Promise.all([
      UserModel.find()
        .lean()
        .skip(parseFloat(page) - 1)
        .limit(parseFloat(limit)),
      UserModel.count(),
    ]);

    return {
      rows: users,
      page,
      limit,
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
    const savedUser = await user.save();
    return savedUser;
  };

  public deleteUser = async (id: string) => {
    await UserModel.deleteOne({ _id: id });
  };
}

export default UsersServices;

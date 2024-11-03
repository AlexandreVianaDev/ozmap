import * as app from "express";
import UsersControllers from "../controllers/users";
import UsersMiddlewares from "../middlewares/users";

const userRouters = app.Router();
const usersControllers = new UsersControllers();
const usersMiddlewares = new UsersMiddlewares();

userRouters.get("/users", usersControllers.getUsers);

userRouters.get(
  "/users/:id",
  usersMiddlewares.userExists,
  usersControllers.getUser,
);

userRouters.post(
  "/users",
  usersMiddlewares.userAddressOrCoordinates,
  usersControllers.createUser,
);

userRouters.put(
  "/users/:id",
  usersMiddlewares.userExists,
  usersMiddlewares.userAddressOrCoordinates,
  usersControllers.updateUser,
);

userRouters.delete(
  "/users/:id",
  usersMiddlewares.userExists,
  usersControllers.deleteUser,
);

export default userRouters;

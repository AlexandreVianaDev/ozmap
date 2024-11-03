import * as app from "express";
import UsersControllers from "../controllers/users";
import UsersMiddlewares from "../middlewares/users";
import RequestsMiddlewares from "../middlewares/requests";
import { userCreateSchema, userUpdateSchema } from "../schemas/users";

const userRouters = app.Router();
const usersControllers = new UsersControllers();
const usersMiddlewares = new UsersMiddlewares();
const requestMiddlewares = new RequestsMiddlewares();

userRouters.get("/users", usersControllers.getUsers);

userRouters.get(
  "/users/:id",
  usersMiddlewares.userExists,
  usersControllers.getUser,
);

userRouters.post(
  "/users",
  requestMiddlewares.validateBodyMiddleware(userCreateSchema),
  usersMiddlewares.userAddressOrCoordinates,
  usersControllers.createUser,
);

userRouters.put(
  "/users/:id",
  requestMiddlewares.validateBodyMiddleware(userUpdateSchema),
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

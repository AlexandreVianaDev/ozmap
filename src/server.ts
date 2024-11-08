import * as app from "express";

import "reflect-metadata";
import "express-async-errors";

import errorHandlerMiddleware from "./middlewares/error";
import userRouters from "./routers/users";
import regionsRouters from "./routers/regions";

const server = app();
const router = app.Router();

server.use(app.json());

server.use(userRouters);
server.use(regionsRouters);

server.use(router);

server.use(errorHandlerMiddleware);

export default server.listen(3003);

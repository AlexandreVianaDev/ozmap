import * as app from "express";
import userRouters from "./routers/users";

const server = app();
const router = app.Router();

server.use(userRouters);
server.use(router);

export default server.listen(3003);

import * as app from "express";
import RegionsControllers from "../controllers/regions";
import UsersMiddlewares from "../middlewares/users";
import RegionsMiddlewares from "../middlewares/regions";

const regionsRouters = app.Router();
const regionsControllers = new RegionsControllers();
const regionsMiddlewares = new RegionsMiddlewares();
const usersMiddlewares = new UsersMiddlewares();

regionsRouters.get("/regions", regionsControllers.getRegions);
regionsRouters.get("/regions/near", regionsControllers.getRegionsNear);

regionsRouters.post(
  "/regions",
  usersMiddlewares.userExists,
  regionsControllers.createRegion,
);
regionsRouters.put(
  "/regions/:id",
  usersMiddlewares.userExists,
  regionsMiddlewares.regionExists,
  regionsControllers.updateRegion,
);
regionsRouters.delete(
  "/regions/:id",
  regionsMiddlewares.regionExists,
  regionsControllers.deleteRegion,
);

export default regionsRouters;

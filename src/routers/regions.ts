import * as app from "express";
import RegionsControllers from "../controllers/regions";
import UsersMiddlewares from "../middlewares/users";
import RegionsMiddlewares from "../middlewares/regions";
import RequestsMiddlewares from "../middlewares/requests";
import {
  regionCompleteUpdateSchema,
  regionCreateSchema,
  regionGetNearSchema,
  regionGetSchema,
  regionUpdateSchema,
} from "../schemas/regions";

const regionsRouters = app.Router();
const regionsControllers = new RegionsControllers();
const regionsMiddlewares = new RegionsMiddlewares();
const usersMiddlewares = new UsersMiddlewares();
const requestMiddlewares = new RequestsMiddlewares();

regionsRouters.get(
  "/regions",
  requestMiddlewares.validateQueryParamsMiddleware(regionGetSchema),
  regionsControllers.getRegions,
);

regionsRouters.get(
  "/regions/near",
  requestMiddlewares.validateQueryParamsMiddleware(regionGetNearSchema),
  regionsControllers.getRegionsNear,
);

regionsRouters.post(
  "/regions",
  requestMiddlewares.validateBodyMiddleware(regionCompleteUpdateSchema),
  usersMiddlewares.userExists,
  regionsControllers.createRegion,
);

regionsRouters.patch(
  "/regions/:id",
  requestMiddlewares.validateBodyMiddleware(regionUpdateSchema),
  usersMiddlewares.userExists,
  regionsMiddlewares.regionExists,
  regionsControllers.updateRegion,
);

regionsRouters.put(
  "/regions/:id",
  requestMiddlewares.validateBodyMiddleware(regionUpdateSchema),
  usersMiddlewares.userExists,
  regionsMiddlewares.regionExists,
  regionsControllers.updateCompleteRegion,
);

regionsRouters.delete(
  "/regions/:id",
  regionsMiddlewares.regionExists,
  regionsControllers.deleteRegion,
);

export default regionsRouters;

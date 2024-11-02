import init from "./database/database";
import server from "./server";
import pino from "pino";

const logger = pino({ level: "info" });

(async () => {
  await init();
  server;
  logger.info("Server is running");
})();

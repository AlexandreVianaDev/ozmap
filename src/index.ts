import init from "./database";
import server from "./server";

const pino = require("pino");
const logger = pino({ level: "info" });

(async () => {
  await init();
  server;
  logger.info("Server is running");
})();

import init from "./database/database";
import server from "./server";
import pino from "pino";

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});

(async () => {
  await init();
  server;
  logger.info("Server is running");
})();

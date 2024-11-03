import mongoose from "mongoose";

const pino = require("pino");
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

const env = {
  MONGO_URI:
    "mongodb://root:example@127.0.0.1:27021/oz-tech-test?authSource=admin",
};

const init = async function () {
  try {
    logger.info("Connecting to MongoDB");
    await mongoose.connect(env.MONGO_URI);
    logger.info("MongoDB connected");
  } catch (e) {
    logger.error("Error connecting to MongoDB:", e);
  }
};

export default init;

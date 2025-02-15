import { Redis } from "ioredis";

const ENV = {
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT!,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
}

if (!ENV.REDIS_HOST || !ENV.REDIS_PORT) {
    throw new Error("REDIS_HOST is required and REDIS_PORT is required");
}

const redis = new Redis({
  host: ENV.REDIS_HOST,
  port: parseInt(ENV.REDIS_PORT),
  password: ENV.REDIS_PASSWORD,
});

export default redis;
import { Redis } from "ioredis";
import "dotenv/config";

const ENV = {
    REDIS_HOST: process.env.REDIS_HOST || "localhost",
    REDIS_PORT: process.env.REDIS_PORT || "6379",
};

// Ensure REDIS_PORT is a valid number
const redisPort = Number(ENV.REDIS_PORT);
if (!ENV.REDIS_HOST || isNaN(redisPort)) {
    throw new Error("REDIS_HOST and a valid REDIS_PORT are required");
}

const redis = new Redis({
    host: ENV.REDIS_HOST,
    port: redisPort,
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});

redis.on("connect", () => {
  console.log("✅Redis connected successfully!");
});

export default redis;

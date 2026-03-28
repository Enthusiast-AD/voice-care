import Redis from "ioredis";

// Create a Redis instance using Upstash URL
const redis = new Redis(process.env.UPSTASH_REDIS_URL || "redis://localhost:6379", {
  connectTimeout: 5000,
  maxRetriesPerRequest: 1, // Fail fast if redis is unreachable instead of hanging the UI
  retryStrategy(times) {
    if (times > 2) {
      return null; // Stop retrying after 2 attempts
    }
    return Math.min(times * 200, 1000);
  }
});

redis.on("error", (error) => {
  console.error("Redis Connection Error:", error.message);
});

redis.on("connect", () => {
  console.log("Connected to Redis successfully");
});

export default redis;

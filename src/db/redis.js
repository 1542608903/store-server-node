const redis = require("redis");
const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
} = require("../config/config.default");
// 连接到 Redis 实例
const redisClient = redis
  .createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
    // password: REDIS_PASSWORD,


    
  })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect((res) => console.log("连接成功redis", res));

module.exports = redisClient;

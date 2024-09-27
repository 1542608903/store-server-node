const Redis = require("ioredis");
const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
} = require("../config/config.default");

// 连接到 Redis 实例
const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  connectTimeout: 5000,
});

// 监听连接事件
redis
  .on("connect", () => {
    console.log("Redis 连接成功");
  })
  .on("error", (err) => {
    console.log("Redis 连接失败", err);
  });

module.exports = redis;

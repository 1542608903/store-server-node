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
  })
  .on("reconnecting", () => {
    console.log("Redis 重新连接中...");
  })
  .on("end", () => {
    console.log("Redis 连接已关闭");
  })
  .on("ready", () => {
    console.log("Redis 准备就绪");
  })
  .on("close", () => {
    console.log("Redis 连接关闭");
  });

module.exports = redis;

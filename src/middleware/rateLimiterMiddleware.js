const { RateLimiterMemory } = require("rate-limiter-flexible");
const redis = require("../db/redis");
const { limitError } = require("../constant/errType");

// 创建限流器
const rateLimiter = new RateLimiterMemory({
  storeClient: redis,
  keyPrefix: "koa-limiter",
  points: 1000, // 10 次请求
  duration: 1, // 每 60 秒
  blockDuration: 60, // 如果超过限制，阻止 300 秒
});

const rateLimiterMiddleware = async (ctx, next) => {
  try {
    // 通过 ip 地址进行限流
    await rateLimiter.consume(ctx.ip);
    await next();
  } catch (err) {
    return ctx.app.emit("error", limitError, ctx);
  }
};

module.exports = { rateLimiterMiddleware };

const { verifyToken, createToken } = require("../config/jwt");
const { JWT_SECRET } = require("../config/config.default"); // 导入 JWT 秘钥
const {
  TokenExpiredError,
  JsonWebTokenError,
  NullTokenError,
  ontAdmin,
  refreshTokenError,
  serverError,
} = require("../constant/errType"); // 导入错误类型
const { isAdmin } = require("../service/userService");

/**
 * 验证用户身份的中间件
 * @param {Object} ctx - Koa 的上下文对象，包含请求和响应信息
 * @param {Function} next - Koa 的下一个中间件函数
 * @returns {Promise<void>}
 */
const auth = async (ctx, next) => {
  try {
    // 从请求头中获取 authorization 字段
    const authorization = ctx.request.header?.authorization || "";

    // 检查是否携带
    if (!authorization) return ctx.app.emit("error", NullTokenError, ctx);

    // 去掉 'Bearer ' 前缀，提取实际的 token 值
    const token = authorization.replace("Bearer ", "");

    // 验证 token 的合法性
    const user = await verifyToken(token, JWT_SECRET);

    ctx.state.user = user;
    // 调用下一个中间件
    await next();
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        return ctx.app.emit("error", TokenExpiredError, ctx);
      case "JsonWebTokenError":
        return ctx.app.emit("error", JsonWebTokenError, ctx);
    }
  }
};

/**
 * 检查是否是管理员
 * @param {Object} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const verifAdmin = async (ctx, next) => {
  try {
    const { user_name } = await ctx.state.user;
    const res = await isAdmin(user_name);
    if (res === null) {
      return ctx.app.emit("error", ontAdmin, ctx);
    }
    await next();
  } catch (err) {
    return ctx.app.emit("error", serverError, ctx);
  }
};

//刷新token的中间件
const refreshToken = async (ctx, next) => {
  const { authorization } = ctx.request.header;

  if (!authorization) {
    return ctx.app.emit("error", NullTokenError, ctx);
  }
  try {
    const token = authorization.replace("Bearer ", "");
    const { iat, exp, vaild, ...user } = await verifyToken(token, JWT_SECRET);
    ctx.state.user = user;
    // 刷新token
    // 刷新token
    const accessToken = await createToken(user, "1h");
    const refreshToken = await createToken(user, "1h");
    // 返回token
    ctx.body = {
      code: 0,
      message: "刷新成功",
      result: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
    await next();
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        return ctx.app.emit("error", refreshTokenError, ctx);
      case "JsonWebTokenError":
        return ctx.app.emit("error", JsonWebTokenError, ctx);
    }
  }
};

// 检测token是否过期
const verifyTokenExpired = async (ctx, next) => {
  try {
    const { authorization } = ctx.request.header;
    if (!authorization) {
      return ctx.app.emit("error", NullTokenError, ctx);
    }
    const token = authorization.replace("Bearer ", "");

    const { vaild } = await verifyToken(token, JWT_SECRET);
    if (vaild) await next();
  } catch (error) {
    switch (error.name) {
      case "TokenExpiredError":
        return ctx.app.emit("error", TokenExpiredError, ctx);
      case "JsonWebTokenError":
        return ctx.app.emit("error", JsonWebTokenError, ctx);
    }
  }
};

module.exports = {
  auth,
  verifAdmin,
  refreshToken,
  verifyTokenExpired,
};

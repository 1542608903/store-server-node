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
const { isAdmin, getUserInfo } = require("../service/userService");

/**
 * 验证用户身份的中间件
 */
const auth = async (ctx, next) => {
  try {
    const authorization = ctx.request.header?.authorization || "";

    if (!authorization) return ctx.app.emit("error", NullTokenError, ctx);

    const token = authorization.replace("Bearer ", "");

    const user = await verifyToken(token, JWT_SECRET);

    ctx.state.user = user;

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
 */
const verifAdmin = async (ctx, next) => {
  try {
    const { id, user_name } = await ctx.state.user;
    const res = await getUserInfo({ id, user_name });

    if (res?.is_admin) {
      await next();
    } else {
      ctx.app.emit("error", ontAdmin, ctx);
    }
  } catch (err) {
    ctx.app.emit("error", serverError, ctx);
    throw err;
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

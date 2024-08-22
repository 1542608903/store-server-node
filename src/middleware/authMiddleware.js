const { verifySecret } = require("../config/jwt");
const { JWT_SECRET } = require("../config/config.default"); // 导入 JWT 秘钥
const {
  TokenExpiredError,
  JsonWebTokenError,
  NullTokenError,
  ontAdmin,
  userLoginError,
} = require("../constant/errType"); // 导入错误类型
const { isAdmin } = require("../service/userService");

/**
 * 验证用户身份的中间件
 * @param {Object} ctx - Koa 的上下文对象，包含请求和响应信息
 * @param {Function} next - Koa 的下一个中间件函数
 * @returns {Promise<void>}
 */
const auth = async (ctx, next) => {
  // 从请求头中获取 authorization 字段
  const { authorization } = ctx.request.header;
  // 检查是否携带 authorization 头部，并且是否以 'Bearer ' 开头
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return ctx.app.emit("error", NullTokenError, ctx);
  }

  try {
    // 去掉 'Bearer ' 前缀，提取实际的 token 值
    const token = authorization.replace("Bearer ", "");

    // 验证 token 并解码，解码后的信息包含在 payload 中（如 id, user_name, is_admin 等）
    // const user = verifySecret(token, JWT_SECRET);
    const user =await verifySecret(token, JWT_SECRET);
    // 将解码后的用户信息存储在 ctx.state 中，供后续中间件使用
    // console.log(user);
    
    ctx.state.user = user;
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        return ctx.app.emit("error", TokenExpiredError, ctx);
      case "JsonWebTokenError":
        return ctx.app.emit("error", JsonWebTokenError, ctx);
    }
  }
  // 调用下一个中间件
  await next();
};

/**
 * 检查是否是管理员
 * @param {Object} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const verifAdmin = async (ctx, next) => {
  
  const { user_name } = await ctx.state.user;
   
  try {
    const res = await isAdmin(user_name);
    if (res === null) {
      return ctx.app.emit("error", ontAdmin, ctx);
    }
    await next();
  } catch (err) {
    console.error("错误", err);
    return ctx.app.emit("error", userLoginError, ctx);
  }
};

module.exports = {
  auth,
  verifAdmin,
};

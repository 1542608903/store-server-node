const { getUserInfo, isAdmin } = require("../service/userService");
const {
  userAlreadyExited,
  userRegisterError,
  notUserExited,
  userLoginError,
  invalidPasswordError,
  ontAdmin,
  passwordError,
} = require("../constant/errType");
const { hashPassword, comparePassword } = require("../utils/bcrypt");

/**
 * 判断用户是否存在
 * @param {Object} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const verifyUserExited = async (ctx, next) => {
  // 合理性判断
  try {
    const { ...user } = ctx.request.body;
    const res = await getUserInfo(user);
    if (res.user_name === user.user_name) {
      return ctx.app.emit("error", userAlreadyExited, ctx);
    }
  } catch (err) {
    return ctx.app.emit("error", userRegisterError, ctx);
  }
  await next();
};

/**
 * BcryptPassword()密码加密方法
 * @param {Object} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const BcryptPassword = async (ctx, next) => {
  try {
    const { password } = ctx.request.body;
    // 加哈希盐
    const hashedPassword = await hashPassword(password);
    // 修改中间件
    ctx.request.body.password = hashedPassword;
    await next();
  } catch (err) {
    return ctx.app.emit("error", userRegisterError, ctx); // Modify error handling as needed
  }
};

/**
 * 登录验证
 * @param {Object} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const verifLogin = async (ctx, next) => {
  try {
    // 明文密码
    const { password, ...user } = ctx.request.body;
    // 哈希密码
    const { password: hashedPassword } = await getUserInfo(user);

    //密码匹配
    const match = await comparePassword(password, hashedPassword);

    if (!match) {
      return ctx.app.emit("error", invalidPasswordError, ctx);
    }
    // 如果用户存在且密码匹配，继续执行
    await next();
  } catch (err) {
    return ctx.app.emit("error", userLoginError, ctx);
  }
};
// 检测账号是否存在的方法
const verifyUser = async (ctx, next) => {
  try {
    const { ...user } = ctx.request.body;
    const res = await getUserInfo(user);
    if (res.user_name === user.user_name) {
      return await next();
    }
  } catch (err) {
    return ctx.app.emit("error", notUserExited, ctx);
  }
  await next();
};
//检测密码身份正确
const verifyPassword = async (ctx, next) => {
  try {
    const { password, ...user } = ctx.request.body;
    const { password: hashedPassword } = await getUserInfo(user);
    const match = await comparePassword(password, hashedPassword);
    if (!match) {
      return ctx.app.emit("error", passwordError, ctx);
    }
    await next();
  } catch (err) {
    return ctx.app.emit("error", passwordError, ctx);
  }
};
module.exports = {
  verifyUserExited,
  BcryptPassword,
  verifLogin,
  verifyUser,
  verifyPassword,

};

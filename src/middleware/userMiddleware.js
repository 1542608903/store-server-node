const { getUserInfo, isAdmin } = require("../service/userService");
const {
  userAlreadyExited,
  userRegisterError,
  notUserExited,
  userLoginError,
  invalidPasswordError,
  ontAdmin,
} = require("../constant/errType");
const { hashPassword, comparePassword } = require("../utilst/bcrypt");

/**
 * 判断用户是否存在
 * @param {Object} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const verifyUserExited = async (ctx, next) => {
  const { password, ...user } = ctx.request.body;

  // 合理性判断
  try {
    const res = await getUserInfo(user);
    if (res && res.user_name === user.user_name) {
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
  const { password } = ctx.request.body;
  if (!password) return 0;
  try {
    //加哈希盐
    const hashedPassword = await hashPassword(password, 10);
    // 修改中间件
    ctx.request.body.password = hashedPassword;
    await next();
  } catch (err) {
    console.error("生成哈希密码时出错", err);
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
    const { password: hashedPassword, ...res } = await getUserInfo(user);

    // 1. 判断用户是否存在
    if (!hashedPassword) {
      return ctx.app.emit("error", notUserExited, ctx);
    }

    // 2. 密码匹配
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

module.exports = {
  verifyUserExited,
  BcryptPassword,
  verifLogin,
};

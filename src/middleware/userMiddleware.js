const { getUserInfo, isAdmin } = require("../service/userService");
const {
  userFormateError,
  userAlreadyExited,
  userRegisterError,
  notUserExited,
  userLoginError,
  invalidPasswordError,
  ontAdmin,
} = require("../constant/errType");
const bcrypt = require("bcryptjs");

/**
 * 合法性判断(弃用)
 * @param {Object} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body;
  // 合法性判断
  if (!user_name || !password) {
    console.error("用户名或密码为空", ctx.request.body);
    return ctx.app.emit("error", userFormateError, ctx);
  }
  await next();
};

/**
 * 合理性判断
 * @param {Object} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const verifyUserExited = async (ctx, next) => {
  const { user_name } = ctx.request.body;
  // 合理性判断
  try {
    const res = await getUserInfo({ user_name });
    if (res && res.user_name === user_name) {
      console.error("用户已存在");
      return ctx.app.emit("error", userAlreadyExited, ctx);
    }
  } catch (err) {
    console.error("获取用户信息错误", err);
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
  // 生成盐
  const salt = bcrypt.genSaltSync(10);
  // 给密码加盐
  const hash = bcrypt.hashSync(password, salt);
  // 修改中间件
  ctx.request.body.password = hash;
  await next();
};

/**
 * 登录验证
 * @param {Object} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const verifLogin = async (ctx, next) => {
  const { user_name, password } = ctx.request.body;
  try {
    // 获取用户信息
    const res = await getUserInfo({ user_name });

    // 1. 判断用户是否存在
    if (!res) {
      console.error("用户不存在", { user_name });
      return ctx.app.emit("error", notUserExited, ctx);
    }

    // 2. 密码匹配
    const pwd = bcrypt.compareSync(password, res.password);
    if (!pwd) {
      console.error("无效的密码", { user_name });
      return ctx.app.emit("error", invalidPasswordError, ctx);
    }

    // 如果用户存在且密码匹配，继续执行
    await next();
  } catch (err) {
    console.error("错误", err);
    return ctx.app.emit("error", userLoginError, ctx);
  }
};

/**
 * 检查是否是管理员
 * @param {Object} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const verifAdmin = async (ctx, next) => {
  const { user_name } = ctx.request.body;
  try {
    const is_admin = true; // 应该根据实际情况设置
    const res = await isAdmin(user_name, is_admin);
    if (res) {
      await next();
    } else {
      return ctx.app.emit("error", ontAdmin, ctx);
    }
  } catch (err) {
    console.error("错误", err);
    return ctx.app.emit("error", userLoginError, ctx);
  }
};

module.exports = {
  userValidator,
  verifyUserExited,
  BcryptPassword,
  verifLogin,
  verifAdmin,
};

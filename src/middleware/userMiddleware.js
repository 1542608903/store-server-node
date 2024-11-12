const { getUserInfo } = require("../service/userService");
const {
  userAlreadyExited,
  userRegisterError,
  notUserExited,
  passwordError,
  emailExited,
} = require("../constant/errType");
const {
  hashPassword,
  comparePassword,
} = require("../utils/passwordUtils/bcrypt");

/**
 * 判断用户是否存在
 * @param {Object} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 */
const verifyUserExists = async (ctx, next) => {
  try {
    const user = ctx.request.body;
    const data = { user_name: user.user_name };
    const res = await getUserInfo(data);
    console.log('user_name通过');
    if (res?.user_name === user.user_name) {
      // 若账号已存在，则抛出错误
      return ctx.app.emit("error", userAlreadyExited, ctx);
    }

    // 如果都不存在，继续执行下一个中间件
    await next();
  } catch (error) {
    throw error;
  }
};

/**
 * 判断邮箱是否存在
 * @param {Object} ctx
 * @param {Function} next
 * @returns {Promise<void>}
 * */
const verifyEmailExists = async (ctx, next) => {
  try {
    const user = ctx.request.body;

    const data = { email: user.email };

    const res = await getUserInfo(data);
    console.log('email通过');
    if (res?.email === user?.email) {
      // 若邮箱已存在，则抛出错误
      return ctx.app.emit("error", emailExited, ctx);
    }

    // 如果都不存在，继续执行下一个中间件
    await next();
  } catch (error) {
    throw error;
  }
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
    return ctx.app.emit("error", userRegisterError, ctx);
  }
};

// 登录时检测账号是否存在的方法
const verifyUser = async (ctx, next) => {
  try {
    const user = ctx.request.body;
    const res = await getUserInfo(user);
    console.log('email通过');

    if (res && res.user_name === user.user_name) {
      // 如果用户存在，继续下一个中间件
      await next();
    } else {
      return ctx.app.emit("error", notUserExited, ctx);
    }
  } catch (error) {
    throw error;
  }
};

//检测密码是否正确
const verifyPassword = async (ctx, next) => {
  try {
    const { password, ...user } = ctx.request.body;
    const userInfo = await getUserInfo(user);

    // 检查用户是否存在
    if (!userInfo) {
      return ctx.app.emit("error", userNotFound, ctx);
    }

    // 获取存储的哈希密码
    const { password: hashedPassword } = userInfo;
    const match = await comparePassword(password, hashedPassword);

    // 如果密码不匹配，触发密码错误事件
    if (!match) {
      return ctx.app.emit("error", passwordError, ctx);
    }

    // 如果匹配，继续执行下一个中间件
    await next();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  verifyUser,
  BcryptPassword,
  verifyPassword,
  verifyUserExists,
  verifyEmailExists,
};

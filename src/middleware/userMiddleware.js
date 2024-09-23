const { getUserInfo } = require("../service/userService");
const {
  userAlreadyExited,
  userRegisterError,
  notUserExited,
  userLoginError,
  invalidPasswordError,
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
    const res = await getUserInfo(user);
    if (!res) {
      await next();
    }else{
      return ctx.app.emit("error", userAlreadyExited, ctx); // Modify error handling as needed
    }
  } catch (err) {
    console.log("verifyUserExists:", err);
    return ctx.app.emit("error", userRegisterError, ctx); // Modify error handling as needed
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
    console.log("BcryptPassword:", err);
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
    console.log("verifLogin:", err);
    return ctx.app.emit("error", userLoginError, ctx);
  }
};
// 检测账号是否存在的方法
const verifyUser = async (ctx, next) => {
  try {
    const { ...user } = ctx.request.body;
    const res = await getUserInfo(user);
    
    if (res.user_name === user.user_name) {
      await next();
    } else {
      return ctx.app.emit("error", notUserExited, ctx);
    }
  } catch (err) {
    console.log("verifyUser:", err);
    return ctx.app.emit("error", notUserExited, ctx);
  }
};
//检测密码是否正确
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
    console.log("verifyPassword:", err);
    return ctx.app.emit("error", passwordError, ctx);
  }
};

// 匹配邮箱
const verifyEmail = async (ctx, next) => {
  try {
    const user = ctx.request.body;
    const res = await getUserInfo(user);
    if (!res) {
      await next();
    }else{
      return ctx.app.emit("error", emailExited, ctx);
    }
  } catch (err) {
    console.log("verifyEmail:", err);
    return ctx.app.emit("error", emailExited, ctx);
  }
};

module.exports = {
  verifLogin,
  verifyUser,
  verifyEmail,
  BcryptPassword,
  verifyPassword,
  verifyUserExists,
};

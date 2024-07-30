const { getUserInfo } = require('../service/userService');
const {
    userFormateError,
    userAlreadyExited,
    userRegisterError,
    notUserExited,
    userLoginError,
    invalidPasswordError,
} = require('../constant/errType');
const bcrypt = require('bcryptjs');
/**
 * 合法性判断
 * @param {Object} ctx 
 * @param {Function} next 
 * @returns {Promise<void>}
 */
const userValidator = async (ctx, next) => {
    const { user_name, password } = ctx.request.body
    //合法性判断
    if (!user_name || !password) {
        console.error('用户或者密码为空', ctx.request.body);
        return ctx.app.emit('error', userFormateError, ctx)
    };
    await next();
}
/**
 * 合理性判断
 * @param {Object} ctx 
 * @param {Function} next 
 * @returns {Promise<void>}
 */
const verifyUser = async (ctx, next) => {
    const { user_name } = ctx.request.body
    //合理性判断
    try {
        const res = await getUserInfo({ user_name });
        if (res) {
            console.error('用户已存在', ctx.request.body);
            ctx.app.emit('error', userAlreadyExited, ctx);
        }
    } catch (err) {
        console.error('获取用户信息错误', err);
        ctx.app.emit('error', userRegisterError, ctx);
    }
    return await next();
}

/**
 * BcryptPassword()密码加密方法
 * @param {Object} ctx 
 * @param {Function} next 
 * @returns {Promise<void>}
 */
const BcryptPassword = async (ctx, next) => {
    const { password } = ctx.request.body
    //生成盐
    const salt = bcrypt.genSaltSync(10);
    //给密码加盐
    const hash = bcrypt.hashSync(password, salt);
    //修改中间件
    ctx.request.body.password = hash

    return await next();
}
/**
 * 登录验证
 * @param {Object} ctx 
 * @param {Function} next 
 * @returns {Promise<void>}
 */
const verifLogin = async (ctx, next) => {

    const { user_name, password } = ctx.request.body
    //try抛出异常
    try {
        //1.判断用户是否存在
        const res = await getUserInfo({ user_name })
        if (!res) {
            console.error('ont user', { user_name });
            ctx.app.emit('error', notUserExited, ctx)
            return
        }
        //2.密码匹配
        if (await !bcrypt.compareSync(password, res.password)) {
            return ctx.app.emit('error', invalidPasswordError, ctx)
        }
        //3.登录成功,返回用户名
    } catch (err) {
        console.error(err);
        return ctx.app.emit('error', userLoginError, ctx)
    }
    await next()
}
module.exports = {
    userValidator,
    verifyUser,
    BcryptPassword,
    verifLogin,
}
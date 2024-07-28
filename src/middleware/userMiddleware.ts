const { getUserInfo } = require('../service/userService')
const { userFormateError, userAlreadyExited } = require('../constant/errType')
const userValidator = async (ctx: any, next: any) => {
    const { user_name, password } = ctx.request.body
    //合法性判断
    if (!user_name || !password) {
        console.error('用户或者密码为空', ctx.request.body);
        ctx.app.emit('error', userFormateError, ctx)
        return
    };
    await next();
}

const verifyUser = async (ctx: any, next: any) => {
    const { user_name } = ctx.request.body
    //合理性判断
    if (await getUserInfo({ user_name })) {
        ctx.app.emit('error', userAlreadyExited, ctx)
        return
    };
    await next();
}

module.exports = {
    userValidator,
    verifyUser,
}
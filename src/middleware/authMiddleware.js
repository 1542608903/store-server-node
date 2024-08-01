const jwt = require('jsonwebtoken'); // 导入 jsonwebtoken 库
const { JWT_SECRET } = require('../config/config.default'); // 导入 JWT 秘钥
const { TokenExpiredError, JsonWebTokenError, hasNotAdminPermission, NullTokenError } = require('../constant/errType'); // 导入错误类型

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
    if (!authorization || !authorization.startsWith('Bearer ')) {
        console.error('未携带 token 或格式错误');
        return ctx.app.emit('error', NullTokenError, ctx);
    }
    // 去掉 'Bearer ' 前缀，提取实际的 token 值
    const token = authorization.replace('Bearer ', '');

    try {
        // 验证 token 并解码，解码后的信息包含在 payload 中（如 id, user_name, is_admin 等）
        const user = jwt.verify(token, JWT_SECRET);

        // 将解码后的用户信息存储在 ctx.state 中，供后续中间件使用
        ctx.state.user = user;
    } catch (err) {
        switch (err.name) {
            case 'TokenExpiredError':
                console.error('token 已过期', err);
                return ctx.app.emit('error', TokenExpiredError, ctx);
            case 'JsonWebTokenError':
                console.error('无效的 token', err);
                return ctx.app.emit('error', JsonWebTokenError, ctx);
        }
    }

    // 调用下一个中间件
    await next();
}

const hadAdminPermission = async (ctx, next) => {
    const { is_admin } = ctx.state.user
    if (!is_admin) {
        console.error('该用户没有管理员权限', ctx.state.user);
        return ctx.app.emit('error', hasNotAdminPermission, ctx)
    }
    await next()
}
const adminLogin =async ()=>{
    
}
module.exports = {
    auth,
    hadAdminPermission,
    adminLogin,
};

const { invalidGoodsID, cartFormatError } = require('../constant/errType');
/**
 * 校验前端数据类型
 * @param {Object} ctx 
 * @param {Function} next 
 * @returns 
 */
const verildatot = (rules) => {
    return async (ctx, next) => {
        try {
            ctx.verifyParams(rules);
            await next();
        } catch (err) {
            console.error('error', err);
            cartFormatError.result = err
            return ctx.app.emit('error', cartFormatError, ctx);
        }
    }

}
module.exports = {
    verildatot,
}
const { goodsFormatError } = require('../constant/errType');
const { invalidGoodsID } = require('../constant/errType');
const { findByPk } = require('../service/goodsService')
/**
 * 验证商品数据格式的中间件
 * @param {Object} ctx - Koa 上下文对象
 * @param {Function} next - Koa 的下一个中间件函数
 * @returns {Promise<void>}
 */
const verildatot = async (ctx, next) => {
    try {
        ctx.verifyParams({
            goods_name: { type: 'string', required: true },
            goods_price: { type: 'number', required: true },
            goods_num: { type: 'number', required: true },
            goods_img: { type: 'string', required: true },
        });
        await next();
    } catch (err) {
        console.error('商品数据格式错误:', err);
        goodsFormatError.result = err.errors;
        ctx.app.emit('error', goodsFormatError, ctx);
    }
};

/**
 * 检查商品ID是否存在的中间件
 * @param {Object} ctx - Koa 上下文对象
 * @param {Function} next - Koa 的下一个中间件函数
 * @returns {Promise<void>}
 */
const checkGoodsExists = async (ctx, next) => {
    const id = ctx.request.body.goods_id;
    try {
        const res = await findByPk(id);
        if (!res) {
            invalidGoodsID.result = id;
            return ctx.app.emit('error', invalidGoodsID, ctx);
        }
        await next();
    } catch (err) {
        console.error('检查商品ID时出错', err);
        ctx.app.emit('error', invalidGoodsID, ctx);
    }
};

module.exports = {
    verildatot,
    checkGoodsExists,
}
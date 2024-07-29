const { invalidGoodsID } = require('../constant/errType')
const verildatot = async (ctx, next) => {
    try {
        ctx.verifyParams({
            goods_id: 'number',
        })
    } catch (err) {
        console.error(err);
        invalidGoodsID.result = err
        return ctx.app.emit('error', invalidGoodsID, ctx);
    }
    return await next()
}

module.exports = {
    verildatot,
}
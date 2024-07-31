const { createGoods, updateGoods, removeGoods, restoreGoods,findGoods } = require('../service/goodsService');
const {
    publishGoodsError,
    invalidGoodsID,
} = require('../constant/errType');
class GoodsController {
    /**
 * 创建商品
 * @param {Object} ctx - Koa 上下文对象
 * @param {Function} next - Koa 的下一个中间件函数
 * @returns {Promise<void>}
 */
    async create(ctx) {
        try {
            const { updatedAt, ...res } = await createGoods(ctx.request.body);
            ctx.body = {
                code: '0',
                message: '发布商品成功',
                result: res
            };
        } catch (err) {
            console.error('发布商品失败', err);
            ctx.app.emit('error', publishGoodsError, ctx);
        }
    }

    /**
     * 更新商品
     * @param {Object} ctx - Koa 上下文对象
     * @param {Function} next - Koa 的下一个中间件函数
     * @returns {Promise<void>}
     */
    async update(ctx) {
        try {
            const { id } = ctx.params;
            const { body } = ctx.request;
            const res = await updateGoods(id, body);
            if (res) {
                return ctx.body = {
                    code: 0,
                    message: '修改商品成功',
                    result: body,
                };
            } else {
                invalidGoodsID.result = id; // 确保错误类型拼写正确
                return ctx.app.emit('error', invalidGoodsID, ctx);
            }
        } catch (err) {
            console.error('修改商品失败', err);
            return ctx.app.emit('error', invalidGoodsID, ctx); // 增加错误处理
        }
    }
    async removal(ctx) {
        const { id } = ctx.params;
        const res = await removeGoods(id);
        if (res) {
            ctx.body = {
                code: 0,
                message: '商品下架成功',
                result: res
            }
        } else {
            return ctx.app.emit('error', invalidGoodsID, ctx); // 增加错误处理
        }
    }
    async restore(ctx) {
        const { id } = ctx.params;
        const res = await restoreGoods(id);
        if (res) {
            ctx.body = {
                code: 0,
                message: '商品上架成功',
                result: res
            }
        } else {
            return ctx.app.emit('error', invalidGoodsID, ctx); // 增加错误处理
        }
    }
    async findAll(ctx) {
        //1.解析pageNum和pageSize
        const { pageNum = 1, pageSize = 10 } = ctx.request.query
        //2.调用数据库方法
        const res = await findGoods(pageNum, pageSize);
        //3.返回结果
        ctx.body = {
            code:0,
            message:'获取商品列表成功',
            result:res
        }
    }
}

module.exports = new GoodsController();

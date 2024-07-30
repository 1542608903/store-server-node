const { 
    createOrUpdate, 
    findCarts, 
    updateCarts, 
    removeCarts, 
    selectALllCarts,
    unSelectAllCarts,
 } = require('../service/cartService');
const { addCartError, getCartError, cartFormatError } = require('../constant/errType');

class CartController {
    /**
     * 添加商品到购物车
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async add(ctx) {
        try {
            // 1. 解析 user_id 和 goods_id
            const user_id = ctx.state.user.id;
            const { goods_id } = ctx.request.body;

            // 操作数据库，创建或更新购物车记录
            const res = await createOrUpdate(user_id, goods_id);

            // 返回结果
            ctx.body = {
                code: 0,
                message: '添加购物车成功',
                result: res,
            };
        } catch (err) {
            console.error('添加购物车失败', err);
            ctx.app.emit('error', addCartError, ctx)
        }
    }
    /**
     * 获取购物车列表
     * @param {Object} ctx - Koa 上下文对象
     * @returns {Promise<void>}
     */
    async findAll(ctx) {
        try {
            const { pageNum = 1, pageSize = 10 } = ctx.request.query;
            const res = await findCarts(pageNum, pageSize);
            return ctx.body = {
                code: 0,
                message: '获取购物车列表成功',
                result: res
            }
        } catch (err) {
            console.error('获取购物车失败', err);
            ctx.app.emit('error', getCartError, ctx)
        }
    }

    async update(ctx) {
        const { id } = ctx.request.params
        const { number, selected } = ctx.request.body;
        if (number === undefined && selected === undefined) {
            return ctx.app.emit('error', cartFormatError, ctx)
        }
        const res = await updateCarts({ id, number, selected });

        ctx.body = {
            code: 0,
            message: '修改购物车成功',
            result: res,
        }
    }
    async remove(ctx) {
        const { ids } = ctx.request.body;
        const res = await removeCarts(ids);
        ctx.body = {
            code: 0,
            message: '删除成功',
            result: res,
        }
    }
    async selectALll(ctx) {
        const user_id = ctx.state.user.id;
        const res = await selectALllCarts(user_id);
        ctx.body = {
            code: 0,
            message: '全部选中',
            result: res
        }
    }
    async unSelectAll(ctx){
        const user_id = ctx.state.user.id;
        const res = await unSelectAllCarts(user_id);
        ctx.body = {
            code:0,
            message:'全部不选中',
            result:res
        }
    }
}

module.exports = new CartController();

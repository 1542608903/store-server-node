const { createOrUpdate } = require('../service/cartService')

class CartController {
    async add(ctx) {
        // 1.解析user_id 和 goods_id
        const user_id = ctx.state.user.id;
        const goods_id = ctx.request.body.goods_id;
        //操作数据库
        const res = await createOrUpdate(user_id, goods_id)
        //返回结果
        ctx.body = {
            code: 0,
            message: '添加购物车成功',
            result: res
        }
        return
    }
}


module.exports = new CartController();
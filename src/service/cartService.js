const Cart = require('../model/cart');
const { Op } = require('sequelize');

class CartService {
    /**
     * 创建或更新购物车条目
     * @param {number} user_id - 用户ID
     * @param {number} goods_id - 商品ID
     * @returns {Promise<Object>} - 返回创建或更新的购物车条目
     */
    async createOrUpdate(user_id, goods_id) {
        const res = await Cart.findOne({
            where: {
                [Op.and]: {
                    user_id,
                    goods_id,
                }
            }
        });

        if (res) {
            // 已经存在一条记录，增加数量
            await res.increment('number');
            return await res.reload(); // 返回更新后的记录
        } else {
            // 创建新的购物车条目
            return await Cart.create({
                user_id,
                goods_id,
            });
        }
    }
}

module.exports = new CartService();

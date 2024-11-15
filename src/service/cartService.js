const Cart = require("../model/cart/cart");
const Goods = require("../model/product/goods");
const { Op } = require("sequelize");

class CartService {
  /**
   * 创建或更新购物车条目
   * @param {number} user_id - 用户ID
   * @param {number} goods_id - 商品ID
   * @param {number} number - 购买数量
   * @returns {Promise<Object>} - 返回创建或更新的购物车条目
   */
  async createOrUpdate(user_id, goods_id) {
    try {
      const res = await Cart.findOne({
        where: {
          [Op.and]: {
            user_id,
            goods_id,
          },
        },
      });
      if (res) {
        // 已经存在一条记录，增加数量
        await res.increment("number");
        return await res.reload(); // 返回更新后的记录
      } else {
        return await Cart.create({ user_id, goods_id });
      }
    } catch (error) {
      throw error;
    }
  }
  /**
   *
   * @param {number} id 购物车id
   * @returns {Promise<Object>} - 返回一条购物车
   */
  async oneUserCart(id, user_id) {
    try {
      const res = await Cart.findOne({
        where: { id, user_id },
        include: { model: Goods, as: "product" },
      });

      return res;
    } catch (error) {
      throw error;
    }
  }

  async oneUserCarts(user_id, pageNum = 1, pageSize = 5) {
    try {
      const offset = (pageNum - 1) * pageSize;
      const { count, rows } = await Cart.findAndCountAll({
        where: { user_id },
        offset: +offset,
        limit: +pageSize,
        order: [["createdAt", "DESC"]],
        include: {
          model: Goods,
          as: "product",
        },
      });
      const totalPages = Math.ceil(count / pageSize);
      pageNum = Math.min(pageNum, totalPages);
      return {
        pageNum,
        pageSize: +pageSize,
        total: totalPages,
        list: rows,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 选中的购物车条目
   * @param {number} user_id  用户ID
   * @param {Array} ids  购物车条目ID数组
   * @returns
   */
  async updateChecke(userId, ids) {
    try {
      // 如果没有选中任何条目，则将所有条目的 selected 设置为 false
      if (ids.length === 0) {
        new CartService().selectALllCarts(userId, false);
        return 0;
      }
      // 使用事务保证两个更新操作的原子性
      const result = await Cart.sequelize.transaction(async (t) => {
        // 1. 先将所有条目的 selected 设置为 false
        await Cart.update(
          { selected: false },
          {
            where: { user_id: userId },
            transaction: t,
          }
        );

        // 2. 再将指定条目的 selected 设置为 true
        const res = await Cart.update(
          { selected: true },
          {
            where: {
              id: {
                [Op.in]: ids,
              },
              user_id: userId,
            },
            transaction: t,
          }
        );
        
        return res;
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateNumber(id, number) {
    try {
      const res = await Cart.update(
        { number },
        {
          where: {
            id,
          },
        }
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  async removeCarts(ids) {
    const res = await Cart.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    return res;
  }

  async selectALllCarts(user_id, isSelect) {
    return await Cart.update(
      { selected: isSelect },
      {
        where: {
          user_id,
        },
      }
    );
  }
}

module.exports = new CartService();

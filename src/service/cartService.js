const Cart = require("../model/cart/cart");
const { Op } = require("sequelize");
const Goods = require("../model/product/goods");

class CartService {
  /**
   * 创建或更新购物车条目
   * @param {number} user_id - 用户ID
   * @param {number} goods_id - 商品ID
   * @param {number} number - 购买数量
   * @returns {Promise<Object>} - 返回创建或更新的购物车条目
   */
  async createOrUpdate(user_id, goods_id, number) {
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
      // 创建新的购物车条目
      return await Cart.create({
        user_id,
        goods_id,
      });
    }
  }
  async oneUserCarts(user_id, pageNum, pageSize) {
    try {
      const offset = (pageNum - 1) * pageSize;
      const { count, rows } = await Cart.findAndCountAll({
        where: { user_id },
        offset: offset,
        limit: +pageSize,
        include: {
          model: Goods,
          as: "product",
        },
      });
      return {
        pageNum,
        pageSize,
        total: count,
        list: rows,
      };
    } catch (error) {
      throw error
    }
  }

  async findCarts(pageNum, pageSize) {
    const offset = (pageNum - 1) * pageSize;
    const { count, rows } = await Cart.findAndCountAll({
      offset: offset,
      limit: +pageSize,
      include: {
        model: Goods,
      },
    });
    return {
      pageNum,
      pageSize,
      total: count,
      list: rows,
    };
  }

  async updateCarts(id, data) {
    const { goods_num: number, selected } = data;
    const res = await Cart.update(
      { selected, number },
      {
        where: {
          id,
        },
      }
    );
    return res;
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

  async selectALllCarts(user_id) {
    return await Cart.update(
      { selected: true },
      {
        where: {
          user_id,
        },
      }
    );
  }
  async unSelectAllCarts(user_id) {
    return await Cart.update(
      { selected: false },
      {
        where: {
          user_id,
        },
      }
    );
  }
}

module.exports = new CartService();

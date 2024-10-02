const Order = require("../model/order/order");
const OrderItem = require("../model/order/orderItem");
const Goods = require("../model/product/goods");
const Address = require("../model/address/address");
const seq = require("../db/seq");
const { Op } = require("sequelize");

class OrderService {
  async createOrder(order, orderItems) {
    const transaction = await seq.transaction(); // 开始事务
    try {
      // 创建订单
      const res = await Order.create(order, { transaction });
      orderItems = orderItems.map((item) => ({
        order_id: res.id,
        goods_id: +item.id,
        price: item.goods_price,
        quantity: item.quantity,
      }));
      await OrderItem.bulkCreate(orderItems, { transaction });
      await transaction.commit();

      return res.dataValues;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  // 查询某个用户下单的商品信息
  async getUserOrdersWithProducts(user_id, pageNum = 1, pageSize = 10) {
    try {
      // 查询数据库
      const offset = (pageNum - 1) * pageSize;
      const { rows, count } = await Order.findAndCountAll({
        where: { user_id },
        offset: offset,
        limit: pageSize,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: OrderItem, // 包含订单项
            include: [
              {
                model: Goods, // 包含商品信息
                as: "product",
              },
            ],
          },
          {
            model: Address,
          },
        ],
      });

      // 确保返回的页码和总页数正确
      const totalPages = Math.ceil(count / pageSize);
      pageNum = Math.min(pageNum, totalPages);
      return {
        pageNum,
        pageSize,
        total: totalPages,
        list: rows,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteOrderById(order_id, transaction) {
    try {
      await OrderItem.destroy({
        where: { order_id },
        transaction,
      });

      const res = await Order.destroy({
        where: { order_id },
        transaction,
      });

      return res;
    } catch (err) {
      throw err;
    }
  }

  async updateOrderStatus(id) {
    try {
      const res = await Order.findByPk(id);
      if (res) {
        res.state = 1;
        await res.save();
        return res;
      }
      return res;
    } catch (error) {
      throw error; // 抛出错误
    }
  }
  /**
   *
   * @param {number} user_id
   * @param {string} goods_name
   * @returns
   */
  async orderSearch(user_id, name) {
    try {
      const orders = await Order.findAll({
        where: { user_id },
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Goods,
                as: "product",
                where: {
                  goods_name: {
                    [Op.like]: `%${name}%`,
                  },
                  deletedAt: null,
                },
              },
            ],
          },
        ],
      });
      return orders ? orders : null;
    } catch (error) {
      throw error; // 抛出错误
    }
  }
  // 查询某个用户下的某个订单
  async findOrderById(user_id, id) {
    try {
      const res = await Order.findOne({
        where: {
          id: id,
          user_id: user_id,
        },
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Goods,
                as: "product",
              },
            ],
          },
          {
            model: Address,
          },
        ],
      });
      return res;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new OrderService();

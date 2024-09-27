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

      // 为每个订单项设置 order_id
      orderItems = orderItems.map((item) => ({
        order_id: res.id,
        goods_id: +item.id,
        price: item.goods_price,
        quantity: item.quantity,
      }));

      // 创建订单项
      await OrderItem.bulkCreate(orderItems, { transaction });

      // 提交事务
      await transaction.commit();
      // 返回订单详细信息
      return res.dataValues;
    } catch (err) {
      // 确保回滚事务
      if (transaction) await transaction.rollback();
      throw err; // 抛出错误
    }
  }

  // 查询某个用户下单的商品信息
  async getUserOrdersWithProducts(user_id) {
    try {
      // 查询数据库
      const orders = await Order.findAll({
        where: { user_id }, // 查询指定的订单
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
      return orders;
    } catch (error) {
      throw error;
    }
  }

  async deleteOrderById(order_id, transaction) {
    try {
      await OrderItem.destroy({
        where: { order_id },
        transaction, // 事务
      });

      const res = await Order.destroy({
        where: { order_id },
        transaction, // 事务
      });

      return res; // 返回删除操作的结果
    } catch (err) {
      throw err; // 抛出错误
    }
  }

  async updateOrderStatus(id) {
    try {
      const res = await Order.findByPk(id);
      if (res) {
        res.state = 1; // 假设状态字段是 status，并设置为1表示已处理

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
  async orderSearch(user_id, goods_name) {
    try {
      const orders = await Order.findAll({
        where: {
          ...(user_id && { user_id: user_id }),
        },
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Goods,
                where: {
                  ...{ goods_name: { [Op.like]: `%${goods_name}%` } },
                },
              },
            ],
          },
        ],
      });
      return orders ? orders.dataValues : null;
    } catch (error) {
      console.error("根据用户ID查找订单时出错:", error);
      throw error; // 抛出错误
    }
  }
  // 查询某个用户下的某个订单
  async findOrderById(user_id, id) {
    try {
      const res = await Order.findOne({
        where: {
          id: +id, // 转换为数字，确保 id 是正确的类型
          user_id: user_id,
        },
        include: [
          {
            model: OrderItem, // 包含订单项
            include: [
              {
                model: Goods, // 包含商品信息
                as: "product", // 确保别名与模型定义中一致
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

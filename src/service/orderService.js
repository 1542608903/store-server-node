const { Order, OrderItem } = require("../model/order");
const User = require("../model/user");
const Goods = require("../model/goods");
const seq = require("../db/seq");

class OrderService {
  async createOrder(order, orderItems) {
    const transaction = await seq.transaction();
    try {
      // 创建订单
      const res = await Order.create(order, { transaction });
      const orderId = res.id; // 获取新订单的 ID

      // 为每个订单项设置 order_id
      orderItems = orderItems.map(item => ({
        ...item,
        order_id: orderId,
      }));

      // 创建订单项
      await OrderItem.bulkCreate(orderItems, { transaction });

      await transaction.commit();
      return res.dataValues;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  // 查询订单及其订单项的函数
  async findOrderWithItems(order_id) {
    const order = await Order.findByPk(order_id, {
      include: {
        model: OrderItem,
        include: {
          model: Goods,
          attributes: ["id", "goods_name", "goods_img", "goods_price"],
        },
      },
    });
    return order;
  }

  async updateOrderStatus(order_id) {
    const res = await Order.findByPk(order_id);
    if (res) {
      res.status = 0; // 假设状态字段是 status
      await res.save();
      return res;
    }
    return null;
  }

  async deleteOrder(order_id) {
    const transaction = await seq.transaction();
    try {
      await OrderItem.destroy({
        where: { order_id },
        transaction,
      });

      const res = await Order.destroy({
        where: { id: order_id },
        transaction,
      });

      await transaction.commit();
      return res;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = new OrderService();

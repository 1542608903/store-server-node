const { Order, OrderItem } = require("../model/order");
const User = require("../model/user");
const Goods = require("../model/goods");
const seq = require("../db/seq");

class OrderService {
  /**
   * 创建一个新的订单及其订单项
   * @param {Object} order - 包含订单数据的对象，必须包含 user_id、address_id、total_price、order_number 和 status
   * @param {Array} orderItems - 包含订单项数据的数组，每项数据必须包含 goods_id、quantity 和 price
   * @returns {Object} - 创建的订单的详细信息
   * @throws {Error} - 如果创建订单或订单项失败，则抛出错误
   */
  async createOrder(order, orderItems) {
    const transaction = await seq.transaction(); // 开始事务
    try {
      // 创建订单
      const res = await Order.create(order, { transaction });
      const orderId = res.id; // 获取新订单的 ID

      // 为每个订单项设置 order_id
      orderItems = orderItems.map((item) => ({
        ...item,
        order_id: orderId,
      }));

      // 创建订单项
      await OrderItem.bulkCreate(orderItems, { transaction });

      await transaction.commit(); // 提交事务
      return res.dataValues; // 返回订单详细信息
    } catch (err) {
      await transaction.rollback(); // 回滚事务
      throw err; // 抛出错误
    }
  }

  /**
   * 查找指定用户的所有订单及其订单项和商品信息
   * @param {number} user_id - 用户 ID
   * @returns {Array} - 包含订单及其相关数据的数组
   * @throws {Error} - 如果查询订单失败，则抛出错误
   */
  async findAllOrderByUserId(user_id) {
    try {
      // 查找用户所有订单，并包含每个订单的订单项及其对应商品信息
      const orders = await Order.findAll({
        where: { user_id },
        include: {
          model: OrderItem,
          include: {
            model: Goods,
            attributes: ["id", "goods_name", "goods_img", "goods_price"], // 指定需要的商品属性
          },
        },
      });

      // 提取所有订单的 dataValues
      const orderData = orders.map((order) => order.dataValues);
      return orderData; // 返回订单数据
    } catch (error) {
      console.error("Error finding orders by user ID:", error);
      throw error; // 抛出错误
    }
  }

  /**
   * 更新指定订单的状态
   * @param {number} order_id - 订单 ID
   * @returns {Object|null} - 更新后的订单对象，如果订单未找到则返回 null
   * @throws {Error} - 如果更新订单状态失败，则抛出错误
   */
  async updateOrderStatus(order_id) {
    const res = await Order.findByPk(order_id); // 查找订单
    if (res) {
      res.status = 0; // 假设状态字段是 status
      await res.save(); // 保存更新
      return res; // 返回更新后的订单对象
    }
    return null; // 如果订单未找到，返回 null
  }

  /**
   * 删除指定订单及其所有订单项
   * @param {number} order_id - 订单 ID
   * @returns {number} - 删除操作的结果，表示被删除的记录数
   * @throws {Error} - 如果删除订单或订单项失败，则抛出错误
   */
  async deleteOrderById(order_id) {
    const transaction = await seq.transaction(); // 开始事务
    try {
      await OrderItem.destroy({
        where: { order_id },
        transaction, // 事务
      });

      const res = await Order.destroy({
        where: { id: order_id },
        transaction, // 事务
      });

      await transaction.commit(); // 提交事务
      return res; // 返回删除操作的结果
    } catch (err) {
      await transaction.rollback(); // 回滚事务
      throw err; // 抛出错误
    }
  }
}

module.exports = new OrderService();

const Order = require("../model/order");
const OrderItem = require("../model/orderItem");
const Goods = require("../model/goods");
const Address = require("../model/address");
const seq = require("../db/seq");
const { Op } = require("sequelize");

class OrderService {
  async createOrder(order, orderItems) {
    const transaction = await seq.transaction(); // 开始事务
    try {
      // 创建订单
      const res = await Order.create(order, { transaction });
      const order_id = res.id; // 获取新订单的 ID

      // 为每个订单项设置 order_id
      orderItems = orderItems.map((item) => ({
        ...item,
        order_id: order_id,
      }));

      // 查询每个商品的库存
      const goodsIds = orderItems.map((item) => item.goods_id);
      const goodsList = await Goods.findAll({
        where: { id: goodsIds },
        transaction,
      });

      // 检查库存是否充足
      for (const item of orderItems) {
        const goods = goodsList.find((g) => g.id === item.goods_id);
        if (!goods || goods.goods_num < item.quantity) {
          throw new Error(`库存不足: ${item.goods_id}`);
        }
      }

      // 更新库存数量
      for (const item of orderItems) {
        const goods = goodsList.find((g) => g.id === item.goods_id);
        goods.goods_num -= item.quantity;
        await goods.save({ transaction });
      }

      // 创建订单项
      await OrderItem.bulkCreate(orderItems, { transaction });

      // 提交事务
      await transaction.commit();

      return res.dataValues; // 返回订单详细信息
    } catch (err) {
      // 确保回滚事务
      if (transaction) await transaction.rollback();
      throw err; // 抛出错误
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
  /**
   *
   * @param {string} user_id
   * @returns
   */
  async findAllOrderByUserId(user_id) {
    try {
      const orders = await Order.findAll({
        where: { user_id },
        include: {
          model: OrderItem,
          include: {
            model: Goods,
            attributes: ["id", "goods_name", "goods_img", "goods_price"],
          },
        },
      });

      const orderData = orders.map((order) => order.dataValues);
      return orderData; // 返回订单数据
    } catch (error) {
      console.error("根据用户ID查找订单时出错:", error);
      throw error; // 抛出错误
    }
  }

  async updateOrderStatus(id, state) {
    try {
      const res = await Order.findByPk(id);
      if (res) {
        res.state = state; // 假设状态字段是 status，并设置为1表示已处理

        await res.save();
        return res;
      }
      return null; // 如果订单未找到，返回 null
    } catch (error) {
      console.error("更新订单状态时出错:", error);
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
  async findAllOrderAddressByUserId() {
    try {
      // 获取所有用户下单的订单地址
      const res = await Order.findAll({
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Goods,
              },
            ],
          },
          {
            model: Address,
          },
        ],
      });
      return console.log(res);
    } catch (error) {
      console.error("查找订单时出错:", error);
      throw error; // 抛出错误
    }
  }
}

module.exports = new OrderService();

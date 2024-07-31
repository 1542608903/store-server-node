const {
  createOrder,
  findAllOrderByUserId,
  deleteOrderById,
} = require("../service/orderService");
const { defaultAddress } = require("../service/addressService");
const { getOrderNumber, mapItemsToOrderItems } = require("../utilst");
const { creatOrderError,deleteOrderError } = require("../constant/errType");

class OrderController {
  /**
   * 创建订单
   * @param {Object} ctx - Koa 的上下文对象
   * @returns {Promise<void>}
   */
  async create(ctx) {
    try {
      const user_id = ctx.state.user.id; // 获取用户 ID
      const items = ctx.request.body.goods_info; // 获取商品信息
      const order_number = "DMB" + getOrderNumber(13); // 生成订单号
      console.log(order_number);

      // 获取用户默认地址
      const { id, ...address } = await defaultAddress(user_id);

      // 计算订单总价
      const order = {
        user_id: user_id,
        address_id: id,
        total_price: items.reduce(
          (total, item) => total + item.goods_price * item.quantity,
          0
        ),
        order_number: order_number,
        state: 0, // 订单状态，假设0表示未处理
      };

      // 将商品信息映射为订单项
      const orderItems = mapItemsToOrderItems(items);

      // 创建订单
      const res = await createOrder(order, orderItems);

      ctx.body = {
        code: 0,
        message: "订单创建成功",
        result: res, // 返回创建的订单详细信息
      };
    } catch (err) {
      console.error("创建订单失败:", err);
      ctx.app.emit("error", creatOrderError, ctx); // 触发错误事件
    }
  }

  /**
   * 查找用户所有订单
   * @param {Object} ctx - Koa 的上下文对象
   * @returns {Promise<void>}
   */
  async findAllOrder(ctx) {
    try {
      const user_id = ctx.state.user.id; // 获取用户 ID
      const res = await findAllOrderByUserId(user_id); // 查找用户所有订单
      console.log(res);

      ctx.body = {
        code: 0,
        message: "获取订单成功",
        result: res, // 返回订单列表
      };
    } catch (err) {
      console.error("获取订单失败:", err);
      ctx.app.emit("error", creatOrderError, ctx); // 触发错误事件
    }
  }
  async deleteOrder(ctx) {
    try {
      const { id } = ctx.params;
      const res = await deleteOrderById(id);
      ctx.body = {
        code: 0,
        message: "删除成功",
        result: "",
      };
    } catch (err) {
      console.error("删除失败");
      ctx.app.emit('error',deleteOrderError,ctx);
    }
  }
}
module.exports = new OrderController();

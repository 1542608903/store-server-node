const {
  createOrder,
  findAllOrderByUserId,
  deleteOrderById,
  updateOrderStatus,
  orderSearch,
  findAllOrderAddressByUserId,
} = require("../service/orderService");
const { getOrderNumber, mapItemsToOrderItems } = require("../utils");
const {
  creatOrderError,
  deleteOrderError,
  verifyOntOrder,
  updateOrderError,
} = require("../constant/errType");

class OrderController {
  /**
   * 创建订单
   * @param {Object} ctx - Koa 的上下文对象
   * @returns {Promise<void>}
   */
  async create(ctx) {
    const user_id = ctx.state.user.id; // 获取用户 ID
    const address_id = ctx.state.address.id; // 获取用户默认地址
    const items = ctx.request.body.goods_info; // 获取商品信息
    const order_number = "DMB" + getOrderNumber(13); // 生成订单号

    if (!user_id && !address_id) {
      console.error("没有数据");
      return 0;
    }
    try {
      // 计算订单总价
      const order = {
        user_id: user_id,
        address_id: address_id,
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
    const user_id = ctx.state.user.id; // 获取用户 ID
    try {
      const res = await findAllOrderByUserId(user_id); // 查找用户所有订单
      ctx.body = {
        code: 0,
        message: "获取订单成功",
        result: res, // 返回订单列表
      };
    } catch (err) {
      console.error("获取订单失败:", err);
      ctx.app.emit("error", verifyOntOrder, ctx); // 触发错误事件
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
      ctx.app.emit("error", deleteOrderError, ctx);
    }
  }
  async updateStatus(ctx) {
    const { id } = ctx.request.params;
    const { state } = ctx.request.body;
    const res = await updateOrderStatus(id, state);
    if (!res) {
      ctx.app.emit("error", updateOrderError, ctx);
      return;
    }
    ctx.body = {
      code: 0,
      message: "状态更新成功",
      result: "",
    };
  }
  async search(ctx) {
    const user_id = ctx.state.user.id;
    const { goods_name } = ctx.request.body;
    const res = await orderSearch(user_id, goods_name);

    if (!res) {
      return 0;
    }

    ctx.body = {
      code: 0,
      message: "搜索订单成功",
      result: res,
    };
  }
  /**
   *
   * @param {*} ctx
   */
  async findAllOrderAddress(ctx) {
    const res = await findAllOrderAddressByUserId();
    console.log(res);
    ctx.body = {
      code: 0,
      message: "获取地址成功",
      result: res,
    };
  }
}

module.exports = new OrderController();

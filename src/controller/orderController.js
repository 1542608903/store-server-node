const {
  createOrder,
  deleteOrderById,
  updateOrderStatus,
  orderSearch,
  getUserOrdersWithProducts,
  findOrderById,
} = require("../service/orderService");
const { getOrderNumber } = require("../utils");
const {
  creatOrderError,
  deleteOrderError,
  verifyOntOrder,
  updateOrderError,
  orderTotalPriceError,
} = require("../constant/errType");

class OrderController {
  /**
   * 创建订单
   * @param {Object} ctx - Koa 的上下文对象
   * @returns {Promise<void>}
   */
  async create(ctx) {
    const user_id = ctx.state.user.id;
    const { id, data, total } = ctx.request.body; // 获取商品信息

    // 计算总价
    let price = 0;
    data.forEach((item) => {
      // price保留两位小数
      price += item.goods_price * item.quantity;
      price = +price.toFixed(2);
    });

    if (price !== total) {
      return ctx.app.emit("error", orderTotalPriceError, ctx);
    }

    // 生成订单号
    const order_number = "DMB" + getOrderNumber(13);

    // 创建订单data
    const order = {
      user_id,
      address_id: id,
      total_price: +price,
      state: 1,
      order_number,
    };

    // 创建订单
    await createOrder(order, data)
      .then((res) => {
        ctx.body = {
          code: 0,
          message: "订单创建成功",
          result: { order: res }, // 返回创建的订单详细信息
        };
      })
      .catch((err) => {
        console.log(err);
        ctx.app.emit("error", creatOrderError, ctx);
      });

    await getUserOrdersWithProducts(user_id).then((res) => {
      ctx.body = {
        code: 0,
        message: "订单列表",
        result: { order: res }, // 返回创建的订单详细信息
      };
    });
  }

  async findAllOrder(ctx) {
    const user_id = ctx.state.user.id; // 获取用户 ID
    try {
      await getUserOrdersWithProducts(user_id).then((res) => {
        ctx.body = {
          code: 0,
          message: "订单列表",
          result: { order: res }, // 返回订单列表
        };
      });
    } catch (err) {
      ctx.app.emit("error", verifyOntOrder, ctx);
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

  async getOneOrder(ctx) {
    const user_id = ctx.state.user.id;
    const { id } = ctx.params;
    await findOrderById(user_id, id)
      .then((res) => {
        ctx.body = {
          code: 0,
          message: "获取订单成功",
          result: { order: res },
        };
      })
      .catch((err) => {
        console.log(err);
        ctx.app.emit("error", verifyOntOrder, ctx);
      });
  }
}

module.exports = new OrderController();

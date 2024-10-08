const {
  createOrder,
  deleteOrderById,
  updateOrderStatus,
  orderSearch,
  getUserOrdersWithProducts,
  findOrderById,
} = require("../service/orderService");

const {
  creatOrderError,
  deleteOrderError,
  verifyOntOrder,
  updateOrderError,
  orderTotalPriceError,
} = require("../constant/errType");
const GenId = require("../utils/IdGenerator");
class OrderController {
  /**
   * 创建订单
   * @param {Object} ctx - Koa 的上下文对象
   * @returns {Promise<void>}
   */
  async create(ctx) {
    try {
      const user_id = ctx.state.user.id;

      let data = ctx.request.body.data;

      const { addressId, total } = data[0];

      data = data.map((item) => ({
        id: item.id,
        goods_price: item.goods_price,
        quantity: item.quantity,
      }));

      const genid = new GenId({ WorkerId: 1 });
      // 计算总价
      let price = 0;

      data.forEach((item) => {
        price += item.goods_price * item.quantity;
        price = +price.toFixed(2);
      });

      if (data.lenght === 0) return ctx.app.emit("error", creatOrderError, ctx);
      if (!total === price) {
        return ctx.app.emit("error", orderTotalPriceError, ctx);
      }
      // 生成订单号
      const order_number = `D${genid.NextId()}`;

      // 创建订单data
      const order = {
        user_id,
        address_id: addressId,
        total_price: +price,
        state: 0,
        order_number,
      };

      // 创建订单
      const res = await createOrder(order, data);
      // 返回消息
      ctx.body = {
        code: 0,
        message: "订单创建成功",
        result: { order: res },
      };
    } catch (error) {
      ctx.app.emit("error", creatOrderError, ctx);
      throw error;
    }
  }

  async findAllOrder(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const { pageNum, pageSize } = ctx.request.body;
      await getUserOrdersWithProducts(user_id, pageNum, pageSize).then(
        (res) => {
          ctx.body = {
            code: 0,
            message: "订单列表",
            result: {
              pageNum: res.pageNum,
              pageSize: res.pageSize,
              total: res.total,
              order: res.list,
            },
          };
        }
      );
    } catch (error) {
      ctx.app.emit("error", verifyOntOrder, ctx);
      throw error;
    }
  }

  async deleteOrder(ctx) {
    try {
      const { id } = ctx.params;
      const res = await deleteOrderById(id);
      ctx.body = {
        code: 0,
        message: "删除成功",
        result: res,
      };
    } catch (error) {
      ctx.app.emit("error", deleteOrderError, ctx);
      throw error;
    }
  }

  async updateStatus(ctx) {
    try {
      const { id } = ctx.request.params;
      const res = await updateOrderStatus(id);
      ctx.body = {
        code: 0,
        message: "状态更新成功",
        result: { order: res },
      };
    } catch (error) {
      ctx.app.emit("error", updateOrderError, ctx);
      throw error;
    }
  }

  async search(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const { name } = ctx.request.query;
      const res = await orderSearch(user_id, name);
      ctx.body = {
        code: 0,
        message: "搜索订单成功",
        result: res,
      };
    } catch (error) {
      ctx.app.emit("error", verifyOntOrder, ctx);
      throw error;
    }
  }

  async getOneOrder(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const id = ctx.params.id;
      const res = await findOrderById(user_id, id);
      ctx.body = {
        code: 0,
        message: "获取订单成功",
        result: { order: res },
      };
    } catch (error) {
      ctx.app.emit("error", verifyOntOrder, ctx);
      throw error;
    }
  }
}

module.exports = new OrderController();

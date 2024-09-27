const {
  createOrUpdate,
  updateCarts,
  removeCarts,
  selectALllCarts,
  oneUserCarts,
  oneUserCart,
} = require("../service/cartService");
const {
  addCartError,
  getCartError,
  cartFormatError,
} = require("../constant/errType");

class CartController {
  /**
   * 添加商品到购物车
   * @param {Object} ctx - Koa 上下文对象
   */
  async addCart(ctx) {
    try {
      // 1. 解析 user_id 和 goods_id
      const user_id = ctx.state.user.id;
      const { goods_id } = ctx.request.body;
      // 操作数据库，创建或更新购物车记录
      const res = await createOrUpdate(user_id, goods_id);
      const cart = await oneUserCart(res.id, user_id);
      ctx.body = {
        code: 0,
        message: "添加购物车成功",
        result: cart,
      };
    } catch (error) {
      ctx.app.emit("error", addCartError, ctx);
      console.log(error);

      throw error;
    }
  }
  /**
   * 获取用户购物车列表
   * @param {Object} ctx - Koa 上下文对象
   */
  async findAll(ctx) {
    try {
      const { id } = ctx.state.user;
      const { pageNum = 1, pageSize = 10 } = ctx.request.query;
      await oneUserCarts(id, pageNum, pageSize).then((res) => {
        ctx.body = {
          code: 0,
          message: "获取购物车列表成功",
          result: res,
        };
      });
    } catch (error) {
      ctx.app.emit("error", getCartError, ctx);
      throw error;
    }
  }

  async update(ctx) {
    const { id } = ctx.request.params;
    const data = ctx.request.body;
    const res = await updateCarts(id, data);
    ctx.body = {
      code: 0,
      message: "修改购物车成功",
      result: res,
    };
  }
  async remove(ctx) {
    try {
      const ids = ctx.request.body;
      const res = await removeCarts(ids);
      if (res) {
        ctx.body = {
          code: 0,
          message: "删除成功",
          result: res,
        };
      } else {
        ctx.body = {
          code: 0,
          message: "没有这条数据",
          result: res,
        };
      }
    } catch (error) {
      throw error;
    }
  }
  async selectALll(ctx) {
    const user_id = ctx.state.user.id;

    const isSelect = ctx.request.body.isSelect;
    const res = await selectALllCarts(user_id, isSelect);
    ctx.body = {
      code: 0,
      message: "操作成功",
      result: res,
    };
  }
}

module.exports = new CartController();

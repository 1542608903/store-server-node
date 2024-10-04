const {
  createOrUpdate,
  updateChecke,
  updateNumber,
  removeCarts,
  selectALllCarts,
  oneUserCarts,
} = require("../service/cartService");
const {
  addCartError,
  getCartError,
  cartFormatError,
} = require("../constant/errType");

class CartController {
  /**
   * 添加商品到购物车
   */
  async addCart(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const { goods_id } = ctx.request.body;
      // 操作数据库，创建或更新购物车记录
      const res = await createOrUpdate(user_id, goods_id);
      ctx.body = {
        code: 0,
        message: "添加成功",
        result: res,
      };
    } catch (error) {
      ctx.app.emit("error", addCartError, ctx);
      console.log(error);

      throw error;
    }
  }
  /**
   * 获取购物车列表
   */
  async findAll(ctx) {
    try {
      const { id } = ctx.state.user;
      const { pageNum, pageSize } = ctx.request.query;
      const res = await oneUserCarts(id, pageNum, pageSize);
      ctx.body = {
        code: 0,
        message: "获取购物车列表",
        result: res,
      };
    } catch (error) {
      ctx.app.emit("error", getCartError, ctx);
      throw error;
    }
  }
  /**
   * 更新购物车
   */
  async updateOneChecke(ctx) {
    try {
      const { id } = ctx.request.params;
      const { selected } = ctx.request.body;
      const res = await updateChecke(id, selected);
      ctx.body = {
        code: 0,
        message: "修改购物车成功",
        result: res,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateOneNumber(ctx) {
    try {
      const { id } = ctx.request.params;
      const { number } = ctx.request.body;
      const res = await updateNumber(id, number);
      ctx.body = {
        code: 0,
        message: "修改购物车成功",
        result: res,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 删除购物车
   */
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

  /**
   * 选择商品
   */
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

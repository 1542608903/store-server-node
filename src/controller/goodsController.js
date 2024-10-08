const {
  createGoods,
  updateGoods,
  removeGoods,
  restoreGoods,
  findGoods,
  getRemoveGoods,
  searchGoods,
} = require("../service/goodsService");
const { publishGoodsError, invalidGoodsID } = require("../constant/errType");
class GoodsController {
  /**
   * 创建商品
   */
  async create(ctx) {
    try {
      const { updatedAt, ...res } = await createGoods(ctx.request.body);
      ctx.body = {
        code: "0",
        message: "发布商品成功",
        result: res,
      };
    } catch (err) {
      console.error("发布商品失败", err);
      ctx.app.emit("error", publishGoodsError, ctx);
    }
  }

  /**
   * 更新商品
   */
  async update(ctx) {
    try {
      const id = ctx.params.id;
      const data = ctx.request.body;
      const res = await updateGoods(id, data);
      if (res) {
        return (ctx.body = {
          code: 0,
          message: "修改商品成功",
          result: body,
        });
      } else {
        return ctx.app.emit("error", invalidGoodsID, ctx);
      }
    } catch (error) {
      ctx.app.emit("error", invalidGoodsID, ctx);
      throw error;
    }
  }

  /**
   * 下架商品
   */
  async removal(ctx) {
    try {
      const { id } = ctx.request.body;
      const res = await removeGoods(id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "商品下架成功",
          result: res,
        };
      } else {
        return ctx.app.emit("error", invalidGoodsID, ctx); // 增加错误处理
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 上架商品
   */
  async restore(ctx) {
    try {
      const { id } = ctx.request.body;
      const res = await restoreGoods(id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "商品上架成功",
          result: res,
        };
      } else {
        return ctx.app.emit("error", invalidGoodsID, ctx); // 增加错误处理
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取商品
   * @param {*} ctx
   */
  async findAll(ctx) {
    try {
      const { pageNum = 1, pageSize = 10 } = ctx.request.query;
      const res = await findGoods(pageNum, pageSize);
      ctx.body = {
        code: 0,
        message: "获取商品列表成功",
        result: res,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取下架的商品
   * @param {*} ctx
   */
  async findAllRemoval(ctx) {
    try {
      const { pageNum, pageSize } = ctx.request.query;
      const res = await getRemoveGoods(pageNum, pageSize);
      ctx.body = {
        code: 0,
        message: "获取商品列表成功",
        result: res,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllSearch(ctx) {
    try {
      const { name } = ctx.request.query;
      const limit = 5;
      const res = await searchGoods(name, limit);

      ctx.body = {
        code: 0,
        message: "搜索成功",
        result: { list: res },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new GoodsController();

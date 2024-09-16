const { userCount,goodsCount,orderCount } = require("../../service/statistics");
class statisticsController {
  /**
   * 获取用户统计数据
   * @param {Object} ctx - Koa 的上下文对象，包含请求和响应信息
   * @returns {Promise<void>}
   */
  async getUserStatistics(ctx) {
    const { starDate, endDate } = ctx.request.body;
    const res = await userCount(starDate, endDate);
    ctx.body = {
      code: 0,
      message: "获取用户统计数据成功",
      result: res,
    };
  }
  // 商品总数
  async getGoodsStatistics(ctx) {
    // 开始统计时间和结束统计时间
    const { starDate, endDate } = ctx.request.body;
    const res = await goodsCount(starDate, endDate);
    ctx.body = {
      code: 0,
      message: "获取商品统计数据成功",
      result: res,
    };
  }

  // 订单量
  async getOrderStatistics(ctx) {
    // 开始统计时间和结束统计时间
    const { starDate, endDate } = ctx.request.body;
    const res = await orderCount(starDate, endDate);
    ctx.body = {
      code: 0,
      message: "获取订单统计数据成功",
      result: res,
    };
  }
}
module.exports = new statisticsController();

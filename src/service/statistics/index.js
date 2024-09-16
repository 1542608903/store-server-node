// 导入用户模型
const User = require("../../model/user/user");
const Goods = require("../../model/product/goods");
const Order = require("../../model/order/order");
const { Op } = require("sequelize");

class statisticsService {
  /**
   *查询用户的总数
   * @param {date} starDate -- "2024-09-01"
   * @param {date} endDate -- "2024-09-30"
   * @returns
   */
  async userCount(starDate = "2024-01-01", endDate = "2024-12-31") {
    const res = await User.count({
      where: {
        createdAt: {
          [Op.between]: [starDate, endDate],
        },
      },
    });
    return res || 0;
  }
  async goodsCount(starDate = "2024-01-01", endDate = "2024-12-31") {
    const res = await Goods.count({
      where: {
        createdAt: {
          [Op.between]: [starDate, endDate],
        },
      },
    });
    return res || 0;
  }

  async orderCount(starDate = "2024-01-01", endDate = "2024-12-31") {
    const res = await Order.count({
      where: {
        createdAt: {
          [Op.between]: [starDate, endDate],
        },
      },
    });
    return res || 0;
  }
}

module.exports = new statisticsService();

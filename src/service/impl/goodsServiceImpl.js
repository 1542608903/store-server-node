const Goods = require("../../model/goods");
class GoodsServiceImpl {
  async stockStatus(id) {
    const res = await Goods.findOne({
      where: {
        id: id,
      },
    });
    return res;
  }
}

module.exports = new GoodsServiceImpl();

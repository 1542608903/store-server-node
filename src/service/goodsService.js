const { Op, where } = require("sequelize");
const { findAll } = require("../controller/addressController");
const Goods = require("../model/goods");

class GoodsService {
  /**
   * 根据 ID 查找商品
   * @param {number} id - 商品的 ID
   * @returns {Promise<Goods>} 返回找到的商品实例
   */
  async findByPk(id) {
    // 使用 findByPk 方法查找商品
    const res = await Goods.findByPk(id);
    return res;
  }

  /**
   * 创建新的商品
   * @param {Object} goods - 包含商品信息的对象
   * @param {string} goods.name - 商品名称
   * @param {number} goods.price - 商品价格
   * @param {string} [goods.description] - 商品描述（可选）
   * @returns {Promise<Object>} 返回创建的商品的详细信息
   */
  async createGoods(goods) {
    // 使用 create 方法创建新商品
    const res = await Goods.create(goods);
    // 返回创建的商品的数据值
    return res.dataValues;
  }

  /**
   * 更新商品信息
   * @param {number} id - 商品的 ID
   * @param {Object} goods - 更新的商品信息
   * @param {string} [goods.name] - 商品名称（可选）
   * @param {number} [goods.price] - 商品价格（可选）
   * @param {string} [goods.description] - 商品描述（可选）
   * @returns {Promise<boolean>} 返回操作是否成功的布尔值
   */
  async updateGoods(id, goods) {
    // 使用 update 方法更新商品
    const res = await Goods.update(goods, { where: { id } });
    // 判断是否有记录被更新
    return res[0] > 0 ? true : false;
  }

  /**
   * 删除商品
   * @param {number} id - 商品的 ID
   * @returns {Promise<boolean>} 返回操作是否成功的布尔值
   */
  async removeGoods(id) {
    // 使用 destroy 方法删除商品
    const res = await Goods.destroy({ where: { id } });
    // 判断是否有记录被删除
    return res > 0 ? true : false;
  }

  /**
   * 恢复已删除的商品
   * @param {number} id - 商品的 ID
   * @returns {Promise<boolean>} 返回操作是否成功的布尔值
   */
  async restoreGoods(id) {
    // 使用 restore 方法恢复已删除的商品
    const res = await Goods.restore({ where: { id } });
    // 判断是否有记录被恢复
    return res > 0 ? true : false;
  }

  /**
   * 分页查询商品列表
   * @param {number} pageNum - 当前页码
   * @param {number} pageSize - 每页显示的商品数量
   * @returns {Promise<Object>} 返回分页的商品列表及相关信息
   * @property {number} pageNum - 当前页码
   * @property {number} pageSize - 每页显示的商品数量
   * @property {number} total - 商品总数
   * @property {Array<Goods>} list - 商品列表
   */
  async findGoods(pageNum, pageSize) {
    // 计算分页的偏移量
    const offset = (pageNum - 1) * pageSize;
    // 使用 findAndCountAll 方法进行分页查询
    const { count, rows } = await Goods.findAndCountAll({
      offset: offset,
      limit: +pageSize,
    });
    // 返回分页数据
    return {
      pageNum,
      pageSize,
      total: count,
      list: rows,
    };
  }
  async findAllGoodsById(arr) {
    if (!arr) {
      return;
    }
    const res = await Goods.findAll({
      attributes: ["id", "goods_name", "goods_price", "goods_num", "goods_img"],
      where: {
        id: {
          [Op.in]: arr,
        },
      },
    });
    return res ? res : undefined;
  }
  //修改商品库存
  async updateStockById(id) {
    const res = await Goods.update({ goods_num }, { where: id });
  }
}

module.exports = new GoodsService();

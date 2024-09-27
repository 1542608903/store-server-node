const { Op } = require("sequelize");
const Goods = require("../model/product/goods");

class GoodsService {
  /**
   * 根据 ID 查找商品
   * @param {number} id - 商品的 ID
   * @returns {Promise<Goods>} 返回找到的商品实例
   */
  async findByPk(id) {
    try {
      // 使用 findByPk 方法查找商品
      const res = await Goods.findByPk(id);
      // 返回找到的商品实例
      return res;
    } catch (error) {
      // 处理错误并抛出
      console.error("Error finding goods:", error);
      throw error;
    }
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
    try {
      // 使用 create 方法创建新商品
      const res = await Goods.create(goods);
      // 返回创建的商品的数据值
      return res.dataValues;
    } catch (error) {
      // 处理错误并抛出
      console.error("Error creating goods:", error);
      throw error;
    }
  }

  /**
   * 更新商品信息
   * @param {number} id - 商品的 ID
   * @param {Object} data - 更新的商品信息
   * @returns {Promise<boolean>} 返回操作是否成功的布尔值
   */
  async updateGoods(id, data) {
    try {
      // 使用 update 方法更新商品
      const res = await Goods.update(data, { where: { id } });
      // 判断是否有记录被更新
      return res[0] > 0 ? true : false;
    } catch (error) {
      // 处理错误并抛出
      console.error("Error updating goods:", error);
      throw error;
    }
  }

  /**
   * 下架商品
   * @param {Array} id - 商品的 ID
   * @returns {Promise<boolean>} 返回操作是否成功的布尔值
   */
  async removeGoods(arr) {
    try {
      // 使用 map 和 Promise.all 等待所有恢复操作完成
      console.log(arr);

      const results = await Promise.all(
        arr.map(async (item) => {
          return Goods.destroy({ where: { id: item } });
        })
      );
      // 判断是否所有记录都已成功
      const allRestored = results.every((result) => result); // 这里根据实际情况判断是否成功
      return allRestored;
    } catch (error) {
      // 处理错误并抛出
      console.error("Error deleting goods:", error);
      throw error;
    }
  }

  /**
   * 恢复已删除的商品
   * @param {Array<number>} arr - 商品的 ID 数组
   * @returns {Promise<boolean>} 返回操作是否成功的布尔值
   */
  async restoreGoods(arr) {
    try {
      // 使用 map 和 Promise.all 等待所有恢复操作完成
      const results = await Promise.all(
        arr.map(async (item) => {
          return Goods.restore({ where: { id: item } });
        })
      );

      // 判断是否所有记录都已恢复成功
      const allRestored = results.every((result) => result); // 这里根据实际情况判断恢复是否成功
      return allRestored;
    } catch (error) {
      // 处理错误并抛出
      console.error("Error restoring goods:", error);
      throw error;
    }
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
  async findGoods(pageNum = 1, pageSize = 8) {
    try {
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
    } catch (error) {
      // 处理错误并抛出
      console.error("findGoods:", error);
      throw error;
    }
  }
  // 获取下架商品
  async getRemoveGoods(pageNum = 1, pageSize = 8) {
    try {
      // 计算分页的偏移量
      const offset = (pageNum - 1) * pageSize;
      const limit = +pageSize; // 转换为数字，确保 limit 参数是正确的类型
      const { count, rows } = await Goods.findAndCountAll({
        where: {
          deletedAt: {
            [Op.not]: null,
          },
        },
        paranoid: false, // 禁用 `paranoid` 过滤
        offset: offset,
        limit: limit,
      });
      // 返回分页数据
      return {
        pageNum,
        pageSize,
        total: count,
        list: rows,
      };
    } catch (error) {
      // 处理错误并抛出
      console.error("getRemoveGoods:", error);
      throw error;
    }
  }

  async findAllGoodsById(arr) {
    try {
      const res = await Goods.findAll({
        attributes: [
          "id",
          "goods_name",
          "goods_price",
          "goods_num",
          "goods_img",
        ],
        where: {
          id: {
            [Op.in]: arr,
          },
        },
      });
      return res ? res : undefined;
    } catch (error) {
      // 处理错误并抛出
      console.error("findAllGoodsById:", error);
      throw error;
    }
  }
  //修改商品库存
  async updateStockById(id) {
    try {
      const res = await Goods.update({ goods_num }, { where: id });
    } catch (error) {
      // 处理错误并抛出
      console.error("updateStockById:", error);
      throw error;
    }
  }

  /**
   *
   * @param {String} name
   * @returns
   */
  async searchGoods(name) {
    try {
      const res = await Goods.findAll({
        where: {
          goods_name: {
            [Op.like]: `%${name}%`,
          },
          deletedAt: null,
        },
        limit: 20,
      });
      return res ? res : undefined;
    } catch (error) {
      // 处理错误并抛出
      console.error("searchGoods:", error);
      throw error;
    }
  }
}

module.exports = new GoodsService();

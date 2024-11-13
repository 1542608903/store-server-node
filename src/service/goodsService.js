const { Op, fn, col, literal, QueryTypes, where } = require("sequelize");
const Goods = require("../model/product/goods");
const { setData, getData } = require("../utils/redis");
const sequelize = require("../db/seq");
class GoodsService {
  /**
   * 创建新的商品
   * @param {Object} goods - 包含商品信息的对象
   * @returns {Promise<Object>} 返回创建的商品的详细信息
   */
  async createGoods(goods) {
    try {
      // 使用 create 方法创建新商品
      const res = await Goods.create(goods);
      // 返回创建的商品的数据值
      return res.dataValues ? res.dataValues : null;
    } catch (error) {
      // 处理错误并抛出
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
      const promises = arr.map((item) =>
        Goods.restore({ where: { id: item } })
      );
      const result = await Promise.all(promises);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 恢复已删除的商品
   */
  async restoreGoods(arr) {
    try {
      const promises = arr.map((item) =>
        Goods.restore({ where: { id: item } })
      );
      const result = await Promise.all(promises);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 分页查询商品列表
   */
  async findGoods(pageNum = 1, pageSize = 10) {
    try {
      const goodsKey = `product:${pageNum}:${pageSize}`;

      // 检查是否有缓存
      if (await getData(goodsKey)) {
        return await getData(goodsKey);
      }

      // 计算分页的偏移量
      const offset = (pageNum - 1) * pageSize;

      // 分页查询
      const { count, rows } = await Goods.findAndCountAll({
        offset: +offset,
        limit: +pageSize,
      });

      // 组合
      const result = {
        pageNum: +pageNum,
        pageSize: +pageSize,
        total: count,
        list: rows,
      };

      // redis缓存
      await setData(goodsKey, result, 30 * 60);

      // 返回分页数据
      return result ? result : null;
    } catch (error) {
      throw error;
    }
  }

  // 获取下架商品
  async getRemoveGoods(pageNum = 1, pageSize = 8) {
    try {
      // 计算分页的偏移量
      const offset = (pageNum - 1) * pageSize;
      const { count, rows } = await Goods.findAndCountAll({
        where: {
          deletedAt: {
            [Op.not]: null,
          },
        },
        paranoid: false,
        offset: +offset,
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
      return res ? res : null;
    } catch (error) {
      throw error;
    }
  }
  //修改商品库存
  async updateStockById(id) {
    try {
      const res = await Goods.update({ goods_num }, { where: id });
    } catch (error) {
      throw error;
    }
  }

  /**
   *搜索商品
   */
  async searchGoodsByName(name, number = 10) {
    try {
      const res = await Goods.findAll({
        where: {
          goods_name: {
            [Op.like]: `%${name}%`,
          },
          deletedAt: null,
        },
        limit: +number,
      });
      return res ? res : null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * 新品
   * @param {*} pageNum
   * @param {*} pageSize
   * @returns
   */
  async queryNewGoogdsAll(pageNum = 1, pageSize = 10) {
    try {
      const newGoodsKey = `new_product:${pageNum}:${pageSize}`;

      // 检查是否有缓存
      if (await getData(newGoodsKey)) {
        return await getData(newGoodsKey);
      }

      // 计算分页的偏移量
      const offset = (pageNum - 1) * pageSize;
      const count = await Goods.count();
      // 分页查询
      const res = await Goods.findAll({
        offset: +offset,
        limit: +pageSize,
        order: [["createdAt", "DESC"]],
      });

      const result = {
        pageNum: +pageNum,
        pageSize: +pageSize,
        total: count,
        list: res,
      };

      // redis缓存
      await setData(newGoodsKey, result, 10 * 60);

      // 返回分页数据
      return result ? result : null;
    } catch (error) {
      throw error;
    }
  }

  async getGoodsWithTotalSales(pageNum = 1, pageSize = 10, order = "ASC") {
    try {
      const salesGoodsKey = `sales_product:${pageNum}:${pageSize}`;

      // 检查是否有缓存
      if (await getData(salesGoodsKey)) {
        return await getData(salesGoodsKey);
      }

      const offset = (pageNum - 1) * pageSize;

      const sql = `
        SELECT goods.*, COALESCE(SUM(order_items.quantity), 0) AS totalSales
        FROM goods
        LEFT JOIN order_items ON goods.id = order_items.goods_id
        WHERE goods.deletedAt IS NULL
        GROUP BY goods.id
        ORDER BY totalSales ${order}
        LIMIT ${pageSize}
        OFFSET ${offset}
      `;

      const [res, count] = await Promise.all([
        sequelize.query(sql, {
          type: QueryTypes.SELECT,
        }),
        Goods.count(),
      ]);

      const result = {
        pageNum: +pageNum,
        pageSize: +pageSize,
        total: count,
        list: res,
      };

      // redis缓存
      await setData(salesGoodsKey, result, 10 * 60);

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 库存减少函数
   * @param {*} id 商品的id
   * @param {*} quantity 购买商品的数量
   * @param {*} transaction 事务
   */
  async productInventory(id, quantity, transaction) {
    try {
      // 查询商品信息
      const product = await Goods.findOne({ where: { id }, transaction });
      if (!product) {
        throw new Error("商品不存在");
      }

      // 检查库存是否足够
      if (product.goods_num < quantity) {
        throw new Error("库存不足");
      }

      // 使用事务更新库存
      const updatedProduct = await product.update(
        { goods_num: product.goods_num - quantity },
        { transaction }
      );

      return updatedProduct;
    } catch (error) {
      console.error("更新库存失败:", error);
      throw error;
    }
  }
  /**
   * 查找一个商品
   * @param {Number} id 商品的id
   */
  async getProductById(id) {
    const res = await Goods.findOne({ where: { id } });
    return res;
  }
}

module.exports = new GoodsService();

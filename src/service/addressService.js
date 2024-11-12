const Address = require("../model/address/address");
const Area = require("../model/area");
const seq = require("../db/seq");
const { Op } = require("sequelize");
const { setData, getData } = require("../utils/redis");
class AddressService {
  /**
   *添加地址服务
   * @param {Object} data -对象
   * @returns {Object}    -res
   */
  async addressCreate(data) {
    try {
      const { user_id } = data;
      let isDefault = false;

      const count = await Address.count({ where: { user_id } });

      count == 0 ? (isDefault = true) : (isDefault = false);

      data["is_default"] = isDefault;

      const res = await Address.create(data);
      return res.dataValues;
    } catch (error) {
      throw error;
    }
  }

  /**
   *查询所有地址服务
   * @param {number} user_id
   * @returns
   */
  async addressFindAll(user_id) {
    try {
      const res = await Address.findAll({
        where: { user_id: user_id },
        attributes: ["id", "address", "consignee", "phone", "is_default"],
      });
      return res;
    } catch (error) {
      throw error;
    }
  }
  /**
   * 更新地址服务
   * @param {number} id 地址id
   * @param {Object} data 地址对象
   */
  async addressUpdate(id, data) {
    try {
      const res = await Address.update(data, {
        where: { id },
      });
      return res;
    } catch (error) {
      throw error;
    }
  }

  async setDefaultAddress(id, user_id) {
    try {
      const is_default = true;
      const transaction = await seq.transaction(); // 开始事务
      // 如果要设置为默认地址，先将该用户的所有地址的 is_default 设置为 false
      await Address.update(
        { is_default: false },
        { where: { user_id }, transaction }
      );
      // 更新指定地址的 is_default 状态
      const [numberOfAffectedRows] = await Address.update(
        { is_default },
        { where: { id, user_id }, transaction }
      );

      await transaction.commit(); // 提交事务

      return numberOfAffectedRows > 0;
    } catch (error) {
      await transaction.rollback(); // 回滚事务
      
      throw error; // 重新抛出错误，以便调用者能够处理
    }
  }

  async queryDefaultAddress(user_id) {
    try {
      const is_default = true;
      const res = await Address.findOne({
        where: {
          user_id: user_id, // 用户ID条件
          is_default: is_default, // 默认地址条件
        },
      });
      return res ? res.dataValues : null;
    } catch (error) {
      throw error;
    }
  }

  async deleteAddressById(user_id, id) {
    const res = await Address.destroy({ where: { user_id, id } });
    return res;
  }

  async queryOneAddress(user_id, id) {
    try {
      const res = await Address.findOne({
        where: {
          id: id,
          user_id: user_id,
        },
      });
      return res ? res.dataValues : null;
    } catch (error) {
      throw error;
    }
  }

  // 三级直辖区查询
  async getAreasGroupedByLevel() {
    try {
      const areasKey = "areas";

      if (await getData(areasKey)) {
        return await getData(areasKey);
      }
      // 查询所有区域
      const areas = await Area.findAll();

      // 创建一个对象用于存储各级区域
      const areaMap = {};

      // 将区域数据按层级存入 areaMap
      areas.forEach((area) => {
        const { area_id, parent_id, name } = area;

        // 如果当前区域的 parent_id 不存在，则初始化
        if (!areaMap[area_id]) {
          areaMap[area_id] = { id: area_id, name, children: [] };
        }

        // 将子区域添加到父区域的 children 中
        if (parent_id) {
          if (!areaMap[parent_id]) {
            areaMap[parent_id] = { id: parent_id, children: [] }; // 确保父级区域存在
          }
          areaMap[parent_id].children.push(areaMap[area_id]);
        }
      });

      // 提取根区域（没有 parent_id 的区域）
      const result = Object.values(areaMap).filter(
        (area) => !areas.find((a) => a.area_id === area.id && a.parent_id)
      );
      // 缓存
      await setData(areasKey, result);

      return result ? result : null;
    } catch (error) {
      console.error("查询区域失败:", error);
      throw error;
    }
  }
}

module.exports = new AddressService();

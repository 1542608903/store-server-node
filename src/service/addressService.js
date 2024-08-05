const seq = require("../db/seq");
const { Op } = require("sequelize");
const Address = require("../model/address");
class AddressService {
  /**
   *添加地址服务
   * @param {Object} data -对象
   * @returns {Object}    -res
   */
  async addressCreate(data) {
    if (!data) {
      throw new Error("Invalid input");
    }
    const { user_id } = data;
    let isDefault = false;
    const { count } = await Address.findAndCountAll({ where: { user_id } });
    count == 0 ? (isDefault = true) : (isDefault = false);
    data["is_default"] = isDefault;
    const res = await Address.create(data);

    return res;
  }

  /**
   *查询所有地址服务
   * @param {number} user_id
   * @returns
   */
  async addressFindAll(user_id) {
    const res = await Address.findAll({ where: { user_id: user_id } });
    return res ? res : null;
  }
  /**
   * 更新地址服务
   * @param {number} id
   * @param {Object} data
   */
  async addressUpdate(id, data) {
    const res = await Address.update(data, {
      where: { id },
    });
    return res[0] > 0 ? true : false;
  }

  async setDefaultAddress(id, user_id, is_default) {
    const transaction = await seq.transaction(); // 开始事务

    try {
      // 如果要设置为默认地址，先将该用户的所有地址的 is_default 设置为 false
      if (is_default) {
        await Address.update(
          { is_default: false },
          { where: { user_id }, transaction }
        );
      }

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
  async defaultAddress(user_id) {
    const is_default = true;
    const res = await Address.findOne(
      {
        where: {
          [Op.and]: [user_id, is_default],
        },
      },
      {
        limit: 1,
      }
    );
    return res ? res : null;
  }
  async deleteAddressById(user_id, id) {
    const res = await Address.destroy({ where: { user_id, id } });
    return res;
  }
}

module.exports = new AddressService();

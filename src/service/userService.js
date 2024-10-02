const { findAll } = require("../controller/addressController");
const User = require("../model/user/user");
const { Op } = require("sequelize");
class UserService {
  /**
   * 创建用户
   * @param {object} [user] - 用户
   * @returns {Promise<Object>} - 返回新创建用户的数据
   */
  async createUser(user) {
    // 插入数据到数据库
    const res = await User.create(user);
    // 返回新创建用户的数据
    return res.dataValues;
  }

  /**
   * 获取用户信息
   * @param {Object} user 用户
   * @returns {Promise<Object|null>} 返回用户数据或 null
   */
  async getUserInfo(user) {
    // 解构出信息，避免传入 undefined 时出错
    const { id, email, user_name, is_admin } = user || {};

    // 条件查询构建（自动忽略 undefined 的值）
    const whereOpt = {
      ...(id && { id }),
      ...(email && { email }),
      ...(user_name && { user_name }),
      ...(is_admin && { is_admin }),
    };

    // 查询用户信息
    const res = await User.findOne({
      where: whereOpt,
    });

    // 返回查询结果
    return res?.dataValues || null;
  }

  /**
   * 根据用户 ID 更新用户信息
   * @param {number} id 用户ID
   * @param {object} data 更新数据
   * @returns {Promise<boolean>} 返回更新是否成功
   */
  async updateById(id, data) {
    // 更新用户信息，返回更新操作的结果
    const res = await User.update(data, { where: { id } });

    // 判断更新是否成功
    return res[0] > 0;
  }
  /**
   * 查询所有用户
   * @param {number} [pageSize=20] - 每页大小
   * @param {number} [pageNum=1] - 页码
   * @returns {Promise<Array<Object>>} - 返回用户数据数组
   */
  async findAllUser(pageSize = 20, pageNum = 1) {
    try {
      const offset = (pageNum - 1) * pageSize;
      const { count, rows } = await User.findAndCountAll({
        limit: +pageSize,
        offset: +offset,
        order: [["createdAt", "DESC"]],
      });

      return {
        pageNum,
        pageSize,
        total: count,
        users: rows,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();

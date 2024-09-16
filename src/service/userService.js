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
   * @param {object} [user] - 用户
   * @returns {Promise<Object|null>} - 返回用户数据或 null
   */
  async getUserInfo(user) {
    // 初始化一个空对象，用于构建查询条件
    const whereOpt = {};
    //解构出信息
    const { id, email, user_name, is_admin } = user;

    // 如果变量存在，添加到查询条件中
    if (id) Object.assign(whereOpt, { id });
    if (email) Object.assign(whereOpt, { email });
    if (user_name) Object.assign(whereOpt, { user_name });
    if (is_admin) Object.assign(whereOpt, { is_admin });

    // 条件查询
    const res = await User.findOne({
      where: whereOpt,
    });
    return res ? res.dataValues : null;
  }

  /**
   * 根据用户 ID 更新用户信息
   * @param {number} user - 用户
   * @returns {Promise<boolean>} - 返回更新是否成功
   */
  async updateById(user) {
    const whereOpt = {};
    const newUser = {};
    const { id, nick_name, email, is_admin, password, avatar } = user;

    // 如果变量存在，添加到新用户中
    if (nick_name) Object.assign(newUser, { nick_name });
    if (email) Object.assign(newUser, { email });
    if (avatar) Object.assign(newUser, { avatar });
    if (is_admin) Object.assign(newUser, { is_admin });
    if (password) Object.assign(newUser, { password });

    // 如果变量存在，添加到查询条件中
    if (id) Object.assign(whereOpt, { id });

    // 更新用户信息，返回更新操作的结果
    const res = await User.update(newUser, { where: whereOpt });

    // 返回更新是否成功
    return res[0] > 0 ? true : false;
  }
  async isAdmin(user_name) {
    const is_admin = true;
    const res = await User.findOne({
      attributes: ["id", "user_name", "password", "is_admin"], // 要查询的字段
      where: {
        user_name,
        is_admin,
      },
    });
    return res ? res.dataValues : null;
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
        attributes: [
          "id",
          "avatar",
          "nick_name",
          "email",
          "user_name",
          "is_admin",
          "createdAt",
          "updatedAt",
        ],
        limit: pageSize,
        offset: offset,
      });

      return {
        total: count,
        users: rows,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
}

module.exports = new UserService();

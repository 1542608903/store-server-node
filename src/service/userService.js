const User = require('../model/user');
class UserService {
    /**
 * 创建用户
 * @param {string} user_name - 用户名
 * @param {string} password - 用户密码
 * @returns {Promise<Object>} - 返回新创建用户的数据
 */
    async createUser(user_name, password) {
        // 插入数据到数据库
        const res = await User.create({ user_name, password });
        // 返回新创建用户的数据
        return res.dataValues;
    }

    /**
     * 获取用户信息
     * @param {Object} params - 查询参数对象
     * @param {number} [params.id] - 用户 ID
     * @param {string} [params.user_name] - 用户名
     * @param {string} [params.password] - 用户密码
     * @param {boolean} [params.is_admin] - 是否为管理员
     * @returns {Promise<Object|null>} - 返回用户数据或 null
     */
    async getUserInfo({ id, user_name, password, is_admin }) {
        // 初始化一个空对象，用于构建查询条件
        const whereOpt = {};

        // 如果 id 存在，添加到查询条件中
        if (id) Object.assign(whereOpt, { id });
        // 如果 user_name 存在，添加到查询条件中
        if (user_name) Object.assign(whereOpt, { user_name });
        // 如果 password 存在，添加到查询条件中
        if (password) Object.assign(whereOpt, { password });
        // 如果 is_admin 存在，添加到查询条件中
        if (is_admin) Object.assign(whereOpt, { is_admin });

        // 查询单个用户
        const res = await User.findOne({
            attributes: ['id', 'user_name', 'password', 'is_admin'], // 要查询的字段
            where: whereOpt, // 查询条件
        });
        // 如果找到用户，返回用户数据；否则返回 null
        return res ? res.dataValues : null;
    }

    /**
     * 根据用户 ID 更新用户信息
     * @param {Object} params - 更新参数对象
     * @param {number} params.id - 用户 ID
     * @param {string} [params.user_name] - 新的用户名
     * @param {string} [params.password] - 新的用户密码
     * @param {boolean} [params.is_admin] - 是否为管理员
     * @returns {Promise<boolean>} - 返回更新是否成功
     */
    async updateById({ id, user_name, password, is_admin }) {
        // 构建查询条件，使用用户 ID 作为条件
        const whereOpt = { id };

        // 构建新的用户信息对象
        const newUser = {};

        // 如果 user_name 存在，添加到新的用户信息对象中
        if (user_name) Object.assign(newUser, { user_name });
        // 如果 password 存在，添加到新的用户信息对象中
        if (password) Object.assign(newUser, { password });
        // 如果 is_admin 存在，添加到新的用户信息对象中
        if (is_admin) Object.assign(newUser, { is_admin });

        // 更新用户信息，返回更新操作的结果
        const res = await User.update(newUser, { where: whereOpt });

        // 返回更新是否成功
        return res[0] > 0 ? true : false;
    }

}

module.exports = new UserService()
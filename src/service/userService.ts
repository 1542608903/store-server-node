const User = require('../model/user');
class UserService {
    /**
     * 创建用户
     * @param user_name 
     * @param password 
     * @returns 
     */
    async createUser(user_name: string, password: string) {
        //插入数据
        const res = await User.create({ user_name, password })

        return res.dataValues;
    }
    /**
     * 
     * @param param0 
     * @returns 
     */
    async getUserInfo({ id, user_name, password, is_admin }: any) {
        // 初始化一个空对象，用于构建查询条件
        const whereOpt = {}

        // 如果 id 存在，添加到查询条件中
        id && Object.assign(whereOpt, { id });
        // 如果 user_name 存在，添加到查询条件中
        user_name && Object.assign(whereOpt, { user_name });
        // 如果 password 存在，添加到查询条件中
        password && Object.assign(whereOpt, { password });
        // 如果 is_admin 存在，添加到查询条件中
        is_admin && Object.assign(whereOpt, { is_admin });

        const res = await User.findOne({
            attributes: ['id', 'user_name', 'password', 'is_admin'],
            where: whereOpt, // 查询条件
        })

        // 如果找到用户，返回用户数据；否则返回 null
        return res ? res.dataValues : null;
    }
}

module.exports = new UserService()
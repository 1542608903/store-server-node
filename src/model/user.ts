import { DataTypes } from "sequelize";
const seq = require('../db/seq')

//创建模型
const User = seq.define('user', {
    user_name: {
        type: DataTypes.STRING,
        //是否为空
        allowNull: false,
        unique: true,
        comment: '用户名,唯一',
    },
    password: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        comment: '密码'
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '是否为管理员,0:不是管理员(默认);1:是管理员'
    },
})
//强制同步数据库
// User.sync({force:true})

module.exports = User
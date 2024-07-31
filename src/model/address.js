const { DataTypes } = require('sequelize');
const sequelize = require('../db/seq'); // 假设你有一个 sequelize 实例文件

const Address = sequelize.define('address', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户ID',
  },
  consignee: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '收货人姓名',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '电话号码',
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '地址',
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否为默认地址',
  },
}, {
  timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  comment: '用户地址表', // 表的注释,
  tableName:'addresses'
});

// 同步模型到数据库
// Address.sync({ force: true }) // 注意：force: true 会删除并重新创建表，慎用

module.exports = Address;

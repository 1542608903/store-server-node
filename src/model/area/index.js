const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

// 定义模型
const Area = seq.define(
  "Area", // 模型名称
  {
    area_id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // 设置为主键
      autoIncrement: true, // 自增
      allowNull: false, // 不允许为 null
    },
    parent_id: {
      type: DataTypes.INTEGER, // 父级区域 ID
      allowNull: true, // 可以为 null
    },
    name: {
      type: DataTypes.STRING, // 区域名称
      allowNull: false, // 不允许为 null
    },
  },
  {
    tableName: "areas", // 数据库表名
    timestamps: false, // 如果不需要自动生成时间戳
  }
);

module.exports = Area;

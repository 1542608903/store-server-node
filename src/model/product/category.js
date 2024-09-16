// 创建商品分类数据模型
const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const Category = seq.define(
  "category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // 分类名称
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      Comment: "分类名称",
    },
    // icon
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      Comment: "分类icon",
    },
    // 备注
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      Comment: "分类描述",
    },
  },
  {
    timestamps: true, // 自动添加createdAt和updatedAt字段
    comment: "商品分类表", // 表的注释
    tableName: "category",
    paranoid: true, // 启用软删除
  }
);

// 导出模型
module.exports = Category;

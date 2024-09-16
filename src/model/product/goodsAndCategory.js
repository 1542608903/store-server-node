const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");
// 创建商品详情模型
const goodsAndCategory = seq.define(
  "goods_category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    goods_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      Comment: "商品id",
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      Comment: "商品分类id",
    },
  },
  {
    timestamps: true, // 自动添加createdAt和updatedAt字段
    comment: "商品分类表", // 表的注释
    tableName: "goods_category",
    paranoid: true, // 启用软删除
  }
);

module.exports = goodsAndCategory;

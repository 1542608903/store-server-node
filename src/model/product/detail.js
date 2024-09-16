const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");
// 创建商品详情模型
const Detail = seq.define(
  "detail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    goods_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // 商品详情
    detail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // 商品详情图片列表
    detail_img: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true, // 自动添加createdAt和updatedAt字段
    comment: "商品表", // 表的注释
    tableName: "detail",
    paranoid: true, // 启用软删除
  }
);

module.exports = Detail;

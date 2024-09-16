const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");

const Goods = seq.define(
  "goods",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    goods_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      Comment: "商品名称",
    },
    goods_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isFloat: true,
        min: 0,
      },
      Comment: "商品价格",
    },
    goods_num: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
      },
      Comment: "商品数量",
    },
    goods_img: {
      type: DataTypes.STRING,
      allowNull: true, // 图片可以为空
      Comment: "商品图片",
    },
  },
  {
    timestamps: true, // 自动添加createdAt和updatedAt字段
    comment: "商品表", // 表的注释
    tableName: "goods",
    paranoid: true, // 启用软删除
  }
);

module.exports = Goods;

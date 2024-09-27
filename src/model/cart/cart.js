const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");
const Goods = require("../product/goods");
const Cart = seq.define(
  "cart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "用户ID",
    },
    goods_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "商品ID",
      references: {
        model: Goods,
        key: "id",
      },
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "商品数量",
    },
    selected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "是否选中",
    },
  },
  {
    timestamps: true,
    comment: "用户购物车表", // 表的注释
    tableName: "carts",
  }
);

// 购物车和商品关联关系
Goods.hasMany(Cart, { foreignKey: "goods_id" });
Cart.belongsTo(Goods, { foreignKey: "goods_id", as: "product" });

module.exports = Cart;

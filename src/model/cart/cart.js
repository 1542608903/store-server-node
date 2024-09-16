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
    timestamps: true, // 如果你希望 Sequelize 自动添加 createdAt 和 updatedAt 字段
    comment: "用户购物车表", // 表的注释
    tableName: "carts",
  }
);
Cart.belongsTo(Goods, {
  foreignKey: "goods_id",
  as: "goods_info",
});
module.exports = Cart;

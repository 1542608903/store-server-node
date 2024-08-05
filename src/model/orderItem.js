// orderItem.js
const { DataTypes } = require("sequelize");
const seq = require("../db/seq");
const Order = require("./order");
const Goods = require("./goods");

const OrderItem = seq.define(
  "order_item",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
      comment: "订单id",
    },
    goods_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Goods,
        key: "id",
      },
      comment: "商品id",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "商品数量",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "商品价格",
    },
  },
  {
    timestamps: true, // 开启 Sequelize 自动添加的时间戳
    comment: "订单项表",
    tableName: "order_items",
  }
);

module.exports = OrderItem;

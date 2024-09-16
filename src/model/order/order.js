const { DataTypes } = require("sequelize");
const seq = require("../../db/seq");
const User = require("../user/user");

const Order = seq.define(
  "order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      comment: "用户id",
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "地址id",
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "订单总价",
    },
    order_number: {
      type: DataTypes.STRING(16),
      allowNull: false,
      comment: "订单编号",
    },
    state: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: "订单状态",
    },
  },
  {
    timestamps: true, // 开启 Sequelize 自动添加的时间戳
    comment: "订单表",
    tableName: "orders",
  }
);

module.exports = Order;

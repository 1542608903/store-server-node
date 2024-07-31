const { DataTypes } = require("sequelize");
const seq = require("../db/seq");
const User = require("./user");
const Goods = require("./goods");

// 定义订单模型
const Order = seq.define(
  "order",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    timestamps: true, // 关闭 Sequelize 自动添加的时间戳
    comment: "订单表",
    tableName:"orders",
  }
);

// 定义订单项模型（表示订单中的商品）
const OrderItem = seq.define(
  "order_item",
  {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order, // 关联到订单模型
        key: "id",
      },
      comment: "订单id",
    },
    goods_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Goods, // 关联到商品模型
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
    timestamps: true, // 关闭 Sequelize 自动添加的时间戳
    comment: "订单项表",
    tableName:'order_items'
  }
);

// 定义关联关系
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

Goods.hasMany(OrderItem, { foreignKey: "goods_id" });
OrderItem.belongsTo(Goods, { foreignKey: "goods_id" });

// Order.sync();
// OrderItem.sync();
module.exports = { Order, OrderItem };

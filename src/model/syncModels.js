const User = require("./user");
const Goods = require("./goods");
const Cart = require("./cart");
const Address = require("./address");
const Order = require("./order");
const OrderItem = require("./orderItem");

// 用户和订单关联关系
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

// 订单与订单项关联关系
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

// 用户和地址关联关系
User.hasMany(Address, { foreignKey: "user_id" });
Address.belongsTo(User, { foreignKey: "user_id" });

Cart.belongsTo(Goods, {
  foreignKey: "goods_id",
  as: "goods_info",
});

// 订单项和商品关联关系
Goods.hasMany(OrderItem, { foreignKey: "goods_id" });
OrderItem.belongsTo(Goods, { foreignKey: "goods_id" });

// 同步模型
const syncModels = async () => {
  try {
    // 先同步基础模型（不带外键依赖的模型）
    await User.sync({ force: true });
    await Goods.sync({ force: true });
    await Address.sync({ force: true });
    await Cart.sync({ force: true });

    // 再同步依赖模型（带有外键的模型）
    await Order.sync({ force: true });
    await OrderItem.sync({ force: true });

    console.log("所有模型同步完成");
  } catch (error) {
    console.error("同步模型时出错:", error);
  }
};

syncModels();

module.exports = { User, Goods, Order, OrderItem, Cart, Address };

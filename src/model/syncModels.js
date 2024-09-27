const User = require("./user/user");
const Goods = require("./product/goods");
const Cart = require("./cart/cart");
const Address = require("./address/address");
const Order = require("./order/order");
const OrderItem = require("./order/orderItem");

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

// 删除所有模型
const dropModels = async () => {
  try {
    // 先删除带外键
    await Address.drop();
    await OrderItem.drop();
    await Cart.drop();
    await Order.drop();
    await User.drop();
    await Goods.drop();
    console.log("所有模型删除成功");
  } catch (error) {
    console.error("删除模型时出错:", error);
  }
};

module.exports = {
  syncModels,
  dropModels,
  User,
  Goods,
  Address,
  Cart,
  Order,
  OrderItem,
};

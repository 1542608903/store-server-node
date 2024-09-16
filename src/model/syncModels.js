const User = require("./user/user");
const Goods = require("./product/goods");
const Category = require("./product/category");
const GoodsCategory = require("./product/goodsAndCategory");
const Cart = require("./cart/cart");
const Address = require("./address/address");
const Order = require("./order/order");
const OrderItem = require("./order/orderItem");

// 用户和订单关联关系
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

// 订单与订单项关联关系
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

// 用户和地址关联关系
User.hasMany(Address, { foreignKey: "user_id" });
Address.belongsTo(User, { foreignKey: "user_id" });

// 用户和购物车关联关系
User.hasMany(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

// 购物车和商品关联关系
Goods.hasMany(Cart, { foreignKey: "goods_id" });
Cart.belongsTo(Goods, {
  foreignKey: "goods_id",
  as: "goods",
});

// 订单项和商品关联关系
Goods.hasMany(OrderItem, { foreignKey: "goods_id" });
OrderItem.belongsTo(Goods, { foreignKey: "goods_id" });

Category.hasMany(GoodsCategory, { foreignKey: "category_id" });
GoodsCategory.belongsTo(Category, { foreignKey: "category_id" });

// 地址和订单关系
Address.hasMany(Order, { foreignKey: "address_id" });
Order.belongsTo(Address, { foreignKey: "address_id" });

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
    await Category.sync({ force: true });
    await GoodsCategory.sync({ force: true });

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
    await GoodsCategory.drop();
    await Cart.drop();
    await Order.drop();
    await User.drop();
    await Goods.drop();
    await Category.drop();

    console.log("所有模型删除成功");
  } catch (error) {
    console.error("删除模型时出错:", error);
  }
};
module.exports = { syncModels, dropModels };

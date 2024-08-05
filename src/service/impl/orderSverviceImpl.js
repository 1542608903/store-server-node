const Order = require("../../model/order");
const OrderItem = require("../../model/orderItem");
class OrderSverviceImpl {
  //检查订单状态
  async orderStateById(id, state = 0) {
    const res = await Order.findOne({
      where: { id: id, state: state },
    });
    return res;
  }
}

module.exports = new OrderSverviceImpl();

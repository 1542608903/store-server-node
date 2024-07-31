const { createOrder, findOrderWithItems } = require("../service/orderService");
const { defaultAddress } = require("../service/addressService");
const { getOrderNumber } = require("../utilst");
class OrderController {
  async create(ctx) {
    const user_id = ctx.state.user.id;
    const items = ctx.request.body.goods_info;
    const order_number = "DMB" + getOrderNumber(13);
    console.log(order_number);
    const { id, ...address } = await defaultAddress(user_id);

    const order = {
      user_id: user_id,
      address_id: id,
      total_price: items.reduce(
        (total, item) => total + item.goods_price * item.quantity,
        0
      ),
      order_number: order_number,
      state: 0,
    };
    // 创建订单项
    const orderItems = items.map((item) => ({
      goods_id: item.id,
      quantity: item.quantity,
      price: item.goods_price,
    }));

    const res = await createOrder(order, orderItems);
    console.log(res);
  }
  async findOrder(ctx) {
    const res = await findOrderWithItems(1);
  }
}

module.exports = new OrderController();

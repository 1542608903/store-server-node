const {
  addressCreate,
  addressFindAll,
  addressUpdate,
  setDefaultAddress,
  defaultAddress,
} = require("../service/addressService");
const { addressUpdateError } = require("../constant/errType");
class AddressController {
  async create(ctx) {
    const user_id = ctx.state.user.id;
    const { consignee, phone, address } = ctx.request.body;
    const data = { user_id, consignee, phone, address };
    const res = await addressCreate(data);
    ctx.body = {
      code: 0,
      messages: "添加地址成功",
      result: res,
    };
  }
  async findAll(ctx) {
    const user_id = ctx.state.user.id;
    const res = await addressFindAll(user_id);
    ctx.body = {
      code: 0,
      messages: "查询所有地址成功",
      result: res,
    };
  }
  async update(ctx) {
    const { id, ...data } = ctx.request.body;
    const res = await addressUpdate(id, data);
    try {
      if (res) {
        return (ctx.body = {
          code: 0,
          messages: "更新成功",
          result: "",
        });
      }
    } catch (err) {
      console.error("更新地址失败");
      ctx.app.emit("error", addressUpdateError, ctx);
    }
  }
  async isOnDefault(ctx) {
    const user_id = ctx.state.user.id;
    const { id, is_default } = ctx.request.body;
    const res = await setDefaultAddress(user_id, id, is_default);
    if (res) {
      ctx.body = {
        code: 0,
        messages: "设为默认地址",
        result: "",
      };
    }
  }
  async getDefaultAddress() {
    const user_id = ctx.state.user.id;
    const res = await defaultAddress(user_id);
    ctx.body = {
      code: 0,
      messages: "获取默认地址",
      result: res,
    };
  }
}

module.exports = new AddressController();

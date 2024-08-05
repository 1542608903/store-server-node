const {
  addressCreate,
  addressFindAll,
  addressUpdate,
  setDefaultAddress,
  defaultAddress,
  deleteAddressById,
} = require("../service/addressService");
const { addressUpdateError, addressNotExited } = require("../constant/errType");
class AddressController {
  
  /**
   *
   *
   * @author DMB
   * @date 2024-08-01 19:08:02
   * @param {*} ctx
   * @memberof AddressController
   */
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
  
  /**
   *
   *
   * @author DMB
   * @date 2024-08-01 19:08:55
   * @param {*} ctx
   * @returns {*} 
   * @memberof AddressController
   */
  async findAll(ctx) {
    const user_id = ctx.state.user.id;
    try {
      const res = await addressFindAll(user_id);
      if (!res) {
        return ctx.app.emit("error", addressNotExited, ctx);
      }

      ctx.body = {
        code: 0,
        messages: "查询所有地址成功",
        result: res,
      };
    } catch (err) {
      console.error("error", err);
    }
  }
  
  /**
   *
   *
   * @author DMB
   * @date 2024-08-01 19:08:49
   * @param {*} ctx
   * @returns {*} 
   * @memberof AddressController
   */
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
  
  /**
   *
   *
   * @author DMB
   * @date 2024-08-01 19:08:37
   * @memberof AddressController
   */
  async getDefaultAddress() {
    const user_id = ctx.state.user.id;
    const res = await defaultAddress(user_id);
    ctx.body = {
      code: 0,
      messages: "获取默认地址",
      result: res,
    };
  }

  /**
   *
   *
   * @author DMB
   * @date 2024-08-01 19:08:41
   * @param {*} ctx
   * @memberof AddressController
   */
  async deleteAddress(ctx) {
    const user_id = ctx.state.user.id;
    const { id } = ctx.params;
    console.log(id);
    const res = await deleteAddressById(user_id, id);
    ctx.body = {
      code: 0,
      messages: "删除成功",
      result: "",
    };
  }
}

module.exports = new AddressController();

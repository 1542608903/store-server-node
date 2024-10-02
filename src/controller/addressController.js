const {
  addressCreate,
  addressFindAll,
  addressUpdate,
  setDefaultAddress,
  defaultAddress,
  deleteAddressById,
} = require("../service/addressService");
const {
  addressUpdateError,
  addressNotExited,
  defaultAddressNotDel,
} = require("../constant/errType");
class AddressController {
  /**
   * @author DMB
   * @date 2024-08-01 19:08:02
   * @param {*} ctx
   * @memberof AddressController
   */
  async create(ctx) {
    const user_id = ctx.state.user.id;
    const { consignee, phone, address } = ctx.request.body;
    const data = { user_id, consignee, phone, address };
    const { updatedAt, createdAt, ...res } = await addressCreate(data);
    ctx.body = {
      code: 0,
      message: "添加地址成功",
      result: { address: res },
    };
  }

  /**
   * 查询我的地址
   */
  async findAll(ctx) {
    const user_id = ctx.state.user.id;
    try {
      const res = await addressFindAll(user_id);

      if (!res) return ctx.app.emit("error", addressNotExited, ctx);

      ctx.body = {
        code: 0,
        message: "查询地址成功",
        result: {
          address: res,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * 更新地址
   */
  async update(ctx) {
    const { id, ...data } = ctx.request.body;
    const res = await addressUpdate(id, data);
    try {
      if (res) {
        return (ctx.body = {
          code: 0,
          message: "更新成功",
          result: "",
        });
      }
    } catch (err) {
      ctx.app.emit("error", addressUpdateError, ctx);
      throw err;
    }
  }
  /**
   * 设置默认地址
   */
  async isOnDefault(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const { id } = ctx.request.body;
      const res = await setDefaultAddress(id, user_id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "设为默认地址",
          result: "",
        };
      } else {
        ctx.app.emit("error", addressNotExited, ctx);
      }
    } catch (error) {
      ctx.app.emit("error", addressNotExited, ctx);
      throw error;
    }
  }

  /**
   * 获取默认地址
   */
  async getDefaultAddress() {
    const user_id = ctx.state.user.id;
    const res = await defaultAddress(user_id);
    ctx.body = {
      code: 0,
      message: "获取默认地址",
      result: res,
    };
  }

  /**
   * 删除地址
   */
  async deleteAddress(ctx) {
    try {
      const user_id = ctx.state.user.id;
      const id = ctx.params.id;
      const res = await deleteAddressById(user_id, id);
      if (res) {
        ctx.app.emit("error", defaultAddressNotDel, ctx);
      } else {
        ctx.body = {
          code: 0,
          message: "删除成功",
          result: res,
        };
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AddressController();

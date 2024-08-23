const {
  createUser,
  getUserInfo,
  updateById,
  findAllUser,
} = require("../service/userService");
const { createToken } = require("../config/jwt");
class UseContrller {
  /**
   * 用户注册方法
   * @param {Object} ctx - Koa 的上下文对象，包含请求和响应信息
   * @param {Function} next - Koa 的下一个中间件函数
   * @returns {Promise<void>}
   */
  async register(ctx) {
    //1.获取数据
    const user = ctx.request.body;
    user.avatar =
      "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
    //2.操作数据库
    const { password, ...res } = await createUser(user);

    return (ctx.body = {
      code: "0",
      message: "用户注册成功",
      result: {
        user_info: res,
      },
    });
  }
  /**
   * 用户登录方法
   * @param {Object} ctx - Koa 的上下文对象，包含请求和响应信息
   * @param {Function} next - Koa 的下一个中间件函数
   * @returns {Promise<void>}
   */
  async login(ctx) {
    const { user_name } = ctx.request.body;

    try {
      // 获取用户信息
      const { password, avatar, nik_name, is_admin, ...user } =
        await getUserInfo({ user_name });

      // 刷新token
      const accessToken = await createToken(user, 20 * 60);
      const refreshToken = await createToken(user, 30 * 60);

      const accessExpiry = Math.floor(Date.now() / 1000) + 20 * 60; // 计算access token到期时间
      const refreshExpiry = Math.floor(Date.now() / 1000) + 30 * 60; // 计算refresh token到期时间
      // 获取当前毫秒数
      const currentTime = Math.floor(Date.now() / 1000);
      console.log(currentTime);

      ctx.body = {
        code: 0,
        message: "登录成功",
        result: {
          user: {
            avatar,
            nik_name,
            is_admin,
            ...user,
          },
          accessToken: accessToken,
          rfreshToken: refreshToken,
          accessExpiry,
          refreshExpiry,
        },
      };
    } catch (err) {
      ctx.body = {
        code: 1,
        message: "登录失败",
        error: err.message,
      };
      console.error("登录失败", err);
    }
  }

  /**
   * 用户修改密码方法
   * @param {Object} ctx
   * @param {Function} next
   * @returns {Promise<void>}
   */
  async changePassword(ctx) {
    //1.获取数据
    const { id } = ctx.state.user;
    const user = ctx.request.body;
    user["id"] = id;
    console.log(user);

    //2.更新到数据库
    const res = await updateById(user);
    //3.返回结果
    if (res) {
      ctx.body = {
        code: 0,
        message: "修改密码成功",
        result: res,
      };
    } else {
      ctx.body = {
        code: "10007",
        message: "修改密码失败",
        result: "",
      };
    }
  }

  async queryUserInfo(ctx) {
    const user = ctx.request.body;
    const { password, ...res } = await getUserInfo(user);

    if (!res) {
      return (ctx.body = {
        code: "10008",
        message: "用户信息不存在",
        result: "",
      });
    }
    ctx.body = {
      code: 0,
      message: "查询成功",
      result: res,
    };
  }
  // 获取所有用户的控制器
  async getAllUser(ctx) {
    const { pageNum, pageSize } = ctx.request.body;

    console.log(pageNum, pageSize);

    const res = await findAllUser(pageSize, pageNum);
    console.log(res);

    ctx.body = {
      code: 0,
      message: "查询成功",
      result: res,
    };
  }
}

module.exports = new UseContrller();

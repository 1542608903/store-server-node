const {
  createUser,
  getUserInfo,
  updateById,
} = require("../service/userService");
const { setRefreshToken, setAccessToken } = require("../config/jwt");

class UseContrller {
  /**
   * 用户注册方法
   * @param {Object} ctx - Koa 的上下文对象，包含请求和响应信息
   * @param {Function} next - Koa 的下一个中间件函数
   * @returns {Promise<void>}
   */
  async register(ctx, next) {
    //1.获取数据
    const { user_name, password } = ctx.request.body;
    //2.操作数据库
    const res = await createUser(user_name, password);
    return (ctx.body = {
      code: "0",
      message: "用户注册成功",
      result: {
        id: res.id,
        user_name: res.user_name,
      },
    });
  }
  /**
   * 用户登录方法
   * @param {Object} ctx - Koa 的上下文对象，包含请求和响应信息
   * @param {Function} next - Koa 的下一个中间件函数
   * @returns {Promise<void>}
   */
  async login(ctx, next) {
    const { user_name } = ctx.request.body;

    try {
      //获取用户信息
      const { password, ...userInfo } = await getUserInfo({ user_name });

      const [accessToken, rfreshToken] = await Promise.all([
        setAccessToken(userInfo),
        setRefreshToken(userInfo, "1d"),
      ]);
      ctx.body = {
        code: 0,
        message: "登录成功",
        result: {
          accessToken: accessToken,
          rfreshToken: rfreshToken,
          userInfo: userInfo,
        },
      };
    } catch (err) {
      return console.error("登录失败", err);
    }
  }
  /**
   * 用户修改密码方法
   * @param {Object} ctx
   * @param {Function} next
   * @returns {Promise<void>}
   */
  async changePassword(ctx, next) {
    //1.获取数据
    const { id } = ctx.state.user;
    const { password } = ctx.request.body;
    //2.更新到数据库
    const res = await updateById({ id, password });
    //3.返回结果
    if (res) {
      ctx.body = {
        code: 0,
        message: "修改密码成功",
        result: "",
      };
    } else {
      ctx.body = {
        code: "10007",
        message: "修改密码失败",
        result: "",
      };
    }
  }
}

module.exports = new UseContrller();

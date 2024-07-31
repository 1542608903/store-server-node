const {
  createUser,
  getUserInfo,
  updateById,
} = require("../service/userService");
const { setRefreshToken, setAccessToken } = require("../config/jwt");
const { JWT_SECRET } = require("../config/config.default");
class UseContrller {
  /**
   * 用户注册方法
   * @param {Object} ctx - Koa 的上下文对象，包含请求和响应信息
   * @param {Function} next - Koa 的下一个中间件函数
   * @returns {Promise<void>}
   */
  async register(ctx, next) {
    //1.获取数据
    console.log(ctx.request.body);
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
    //使用JWT
    try {
      /**
       * 获取用户信息
       * 函数返回的对象中的 password 属性提取出来，并将其余属性放入 resUser 对象中。
       */
      const { password, ...userInfo } = await getUserInfo({ user_name });

      const [accessToken, rfreshToken] = await Promise.all([
        setAccessToken(userInfo, "1d"),
        setRefreshToken(userInfo, "1d"),
      ]);
      ctx.request.header.authorization = `Bearer ${rfreshToken}`;
      ctx.body = {
        code: 0,
        message: "登录成功",
        result: {
          token: accessToken,
        },
      };
    console.log(ctx);
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
    if (await updateById({ id, password })) {
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
    //3.返回结果
  }
}

module.exports = new UseContrller();

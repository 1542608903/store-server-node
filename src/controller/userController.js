const {
  createUser,
  getUserInfo,
  updateById,
  findAllUser,
  userCount,
} = require("../service/userService");
const { createToken } = require("../config/jwt");
class UseContrller {
  /**
   * 用户注册方法
   * @returns {Promise<void>}
   */
  async register(ctx) {
    try {
      //1.获取数据
      const user = ctx.request.body;
      user.avatar ="http://127.0.0.1:8888/online/e88786a0140ef17cf93350e00.png"
      //2.操作数据库
      const { password, ...res } = await createUser(user);

      ctx.body = {
        code: "0",
        message: "用户注册成功",
        result: {},
      };
    } catch (error) {
      // 处理错误并抛出
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  /**
   * 用户登录方法
   */
  async login(ctx) {
    try {
      // 获取用户信息
      const { user_name } = ctx.request.body;
      const { password, avatar, nick_name, is_admin, ...user } =
        await getUserInfo({ user_name });
      // 刷新token
      const accessToken = await createToken(user, "1h");
      const refreshToken = await createToken(user, "1h");
      ctx.body = {
        code: 0,
        message: "登录成功",
        result: {
          user: {
            avatar,
            nick_name,
            is_admin,
            ...user,
          },
          accessToken: accessToken,
          rfreshToken: refreshToken,
        },
      };
    } catch (err) {
      // 处理错误并抛出
      console.error("Error getting all users:", err);
      throw err;
    }
  }

  /**
   * 用户修改密码方法
   * @returns {Promise<void>}
   */
  async changePassword(ctx) {
    try {
      //1.获取数据
      const { id } = ctx.state.user;
      const user = ctx.request.body;
      user["id"] = id;

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
    } catch (error) {
      // 处理错误并抛出
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  async queryUserInfo(ctx) {
    try {
      const user = ctx.request.body;
      const { password, ...res } = await getUserInfo(user);

      if (!res) {
        ctx.body = {
          code: "10008",
          message: "用户信息不存在",
          result: "",
        };
      } else {
        ctx.body = {
          code: 0,
          message: "查询成功",
          result: res,
        };
      }
    } catch (error) {
      // 处理错误并抛出
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  // 获取所有用户的控制器
  async getAllUser(ctx) {
    try {
      const pageNum = ctx.request.body?.pageNum;
      const pageSize = ctx.request.body?.pageSize;
      const res = await findAllUser(pageSize, pageNum);
      ctx.body = {
        code: 0,
        message: "查询成功",
        result: res,
      };
    } catch (error) {
      // 处理错误并抛出
      console.error("Error getting all users:", error);
      throw error;
    }
  }
}
module.exports = new UseContrller();

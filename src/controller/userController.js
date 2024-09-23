const {
  createUser,
  getUserInfo,
  updateById,
  findAllUser,
} = require("../service/userService");
const { createToken } = require("../config/jwt");
const {
  comparePassword,
  hashPassword,
} = require("../utils/passwordUtils/bcrypt");
class UseContrller {
  /**
   * 用户注册方法
   * @returns {Promise<void>}
   */
  async register(ctx) {
    try {
      //1.获取数据
      const user = ctx.request.body;
      user.avatar =
        "http://127.0.0.1:8888/online/e88786a0140ef17cf93350e00.png";
      //2.操作数据库
      const { password, ...res } = await createUser(user);

      ctx.body = {
        code: "0",
        message: "用户注册成功",
        result: {
          user: res,
        },
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
      const userInfo = ctx.request.body;
      const { password, ...user } = await getUserInfo(userInfo);
      const { id, email, user_name } = user;
      // 刷新token
      const accessToken = await createToken({ id, email, user_name }, "2h");
      const refreshToken = await createToken({ id, email, user_name }, "2h");
      ctx.body = {
        code: 0,
        message: "登录成功",
        result: {
          user: user,
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
   */
  async changePassword(ctx) {
    try {
      //1.获取数据
      const { id } = ctx.state.user;
      const { old_password, new_password } = ctx.request.body;
      const res = await getUserInfo({ id });
      const match = await comparePassword(old_password, res.password);
      //2.更新到数据库
      if (match) {
        // 验证成功后进行加密
        const hash_password = await hashPassword(new_password);
        if (!hash_password) {
          return;
        }
        await updateById(id, { password: hash_password })
          .then((res) => {
            ctx.body = {
              code: 0,
              message: "修改密码成功",
              result: res,
            };
          })
          .catch((err) => {
            ctx.body = {
              code: "10007",
              message: "修改密码失败",
              result: "",
            };
            throw err;
          });
      } else {
        ctx.body = {
          code: "10008",
          message: "原密码错误",
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

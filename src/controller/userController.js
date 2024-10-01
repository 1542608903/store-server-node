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

const {
  updateUserError,
  updatePasswordError,
  oldPasswordError,
  notUserExited,
} = require("../constant/errType");
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
        "http://47.119.172.215:9988/online/0008cbace240eee93a3327500.jpg";
      //2.操作数据库
      const { password, ...res } = await createUser(user);

      ctx.body = {
        code: 0,
        message: "用户注册成功",
        result: {
          user: res,
        },
      };
    } catch (error) {
      // 处理错误并抛出
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
      const accessToken = await createToken({ id, email, user_name }, "3h");
      const refreshToken = await createToken({ id, email, user_name }, "3h");
      ctx.body = {
        code: 0,
        message: "登录成功",
        result: {
          user: user,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * 用户修改密码
   */
  async changePassword(ctx) {
    try {
      //1.获取数据
      const { id } = ctx.state.user;
      const { old_password, new_password } = ctx.request.body;
      const res = await getUserInfo({ id });
      const match = await comparePassword(old_password, res.password);

      if (match) {
        // 验证成功后进行加密
        const hash_password = await hashPassword(new_password);

        if (!hash_password) return;
        // 更新数据库
        const res = await updateById(id, { password: hash_password });
        ctx.body = {
          code: 0,
          message: "修改密码成功",
          result: res,
        };
      } else {
        ctx.app.emit("error", oldPasswordError, ctx);
      }
    } catch (error) {
      ctx.app.emit("error", updatePasswordError, ctx);
      throw error;
    }
  }

  async changeUser(ctx) {
    try {
      const { id } = ctx.state.user;
      const data = ctx.request.body;
      const res = await updateById(id, data);

      if (res) {
        const { password, ...data } = await getUserInfo({id});
        ctx.body = {
          code: 0,
          message: "修改信息成功",
          result: data,
        };
      } else {
        ctx.app.emit("error", updateUserError, ctx);
      }
    } catch (error) {
      ctx.app.emit("error", updateUserError, ctx);
      throw error;
    }
  }
  /**
   * 查询用户
   * @param {*} ctx
   */
  async queryUserInfo(ctx) {
    try {
      const user = ctx.request.body;
      const { password, ...res } = await getUserInfo(user);

      if (!res) {
        ctx.app.emit("error", notUserExited, ctx);
      } else {
        ctx.body = {
          code: 0,
          message: "查询成功",
          result: res,
        };
      }
    } catch (error) {
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
      throw error;
    }
  }
}
module.exports = new UseContrller();

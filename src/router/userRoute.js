// 引入 Koa 路由
const Router = require("koa-router");
// 导入控制器方法
const {
  register,
  login,
  changePassword,
} = require("../controller/userController");
// 导入中间件
const {
  userValidator, // 用于验证用户输入数据的中间件
  verifyUserExited, // 用于检查用户名是否已存在的中间件
  BcryptPassword, // 用于对用户密码进行加密的中间件
  verifLogin, // 用于验证用户登录数据的中间件
  verifAdmin,
} = require("../middleware/userMiddleware");
const { verildatot } = require("../middleware/genericMiddleware");
const { auth } = require("../middleware/authMiddleware"); // 用于用户认证的中间件
const { userFormateError } = require("../constant/errType");
const { userFormateRules } = require("../constant/rules");
// 实例化路由，并设置前缀为 '/user'
const router = new Router({ prefix: "/user" });

/**
 * 用户路由配置
 */

// 注册接口
// POST /user/register
// 中间件顺序：
// 1. `verildatot(userLoginRules, userFormateError)`：使用通用中间件验证请求体中的用户数据是否合法
// 2. `verifyUser`：检查用户名是否已经存在
// 3. `BcryptPassword`：对用户密码进行加密
// 4. `register`：调用控制器方法完成用户注册
router.post("/register",verildatot(userFormateRules,userFormateError), verifyUserExited, BcryptPassword, register);

// 登录接口
// POST /user/login
// 中间件顺序：
// 1. `verildatot(userLoginRules, userFormateError)`：使用通用中间件验证请求体中的登录数据是否合法
// 2. `verifLogin`：验证请求体中的登录数据是否合法
// 3. `login`：调用控制器方法完成用户登录
router.post(
  "/login",
  verildatot(userFormateRules, userFormateError),
  verifLogin,
  login
);

// 修改密码接口
// PATCH /user
// 中间件顺序：
// 1. `auth`：认证用户，确保请求者已经登录
// 2. `BcryptPassword`：对新密码进行加密
// 3. `changePassword`：调用控制器方法完成密码修改
router.patch("/", auth, BcryptPassword, changePassword);

// 管理员登录接口
// POST /user/admin
// 中间件顺序：
// 1. `verildatot`：使用通用中间件验证请求体中的管理员登录数据是否合法
// 2. `verifLogin`：验证请求体中的登录数据是否合法
// 3. `verifAdmin`：验证管理员权限
// 4. `login`：调用控制器方法完成管理员登录
router.post(
  "/admin",
  verildatot(userFormateRules, userFormateError),
  verifLogin,
  verifAdmin,
  login
);

// 导出路由模块
module.exports = router;

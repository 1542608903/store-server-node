// 引入 Koa 路由
const Router = require("koa-router");
// 导入控制器方法
const {
  register,
  login,
  changePassword,
  queryUserInfo,
  getAllUser,
} = require("../controller/userController");
// 导入中间件
const {
  verifyUserExists, // 用于检查用户名是否已存在的中间件
  BcryptPassword, // 用于对用户密码进行加密的中间件
  verifLogin, // 用于验证用户登录数据的中间件
  verifyPassword,
  verifyUser,
  verifyEmail,
} = require("../middleware/userMiddleware");
const { verildatot } = require("../middleware/genericMiddleware");
const {
  auth,
  verifAdmin,
  refreshToken,
} = require("../middleware/authMiddleware"); // 用于用户认证的中间件
const { userFormateError } = require("../constant/errType");
const { registerRules, loginRules } = require("../constant/rules");
// 实例化路由，并设置前缀为 '/user'

const router = new Router({ prefix: "/user" });


// 注册接口
// POST /user/register
router.post(
  "/register",
  verildatot(registerRules, userFormateError), //使用通用中间件验证请求体中的用户数据是否合法
  verifyUserExists, //检查用户名是否已经存在
  verifyEmail, //检查邮箱是否已经存在
  BcryptPassword, //对用户密码进行加密
  register //调用控制器方法完成用户注册
);

// 登录接口
// POST /user/login
router.post(
  "/login",
  verildatot(loginRules, userFormateError),
  verifyUser,
  verifyPassword,
  verifLogin,
  login
);

// 修改密码接口
// PATCH /user
router.patch("/:id", auth, BcryptPassword, changePassword);

// 管理员登录接口
// POST /user/admin
router.post(
  "/admin",
  verildatot(loginRules, userFormateError),
  verifyUser,
  verifyPassword,
  verifLogin,
  login
);

router.post("/", auth, verifAdmin, queryUserInfo);

router.post("/all", auth, verifAdmin, getAllUser);

router.post("/refresh_token", refreshToken);
// 导出路由模块
module.exports = router;

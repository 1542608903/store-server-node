// 引入 Koa 路由
const Router = require("koa-router");

// 引入文件格式验证中间件
const { fileValidator } = require("../middleware/uploadMiddleware");
// 引入认证和权限中间件
const { auth, verifAdmin } = require("../middleware/authMiddleware");
// 引入商品验证中间件
const { verildatot } = require("../middleware/goodsMiddleware");
// 引入商品控制器方法
const {
  create,
  update,
  removal,
  restore,
  findAll,
} = require("../controller/goodsController");

// 实例化路由，并设置前缀为 '/goods'
const router = new Router({ prefix: "/goods" });

// 路由：创建商品
// POST /goods/
// 中间件顺序：
// 1. `auth`：认证用户，确保请求者已登录
// 2. `hadAdminPermission`：检查用户是否具有管理员权限
// 3. `verildatot`：验证商品数据的合法性
// 4. `create`：调用控制器方法创建商品
router.post("/", auth, verifAdmin, verildatot, create);

// 路由：更新商品信息
// PUT /goods/:id
// 中间件顺序：
// 1. `auth`：认证用户，确保请求者已登录
// 2. `hadAdminPermission`：检查用户是否具有管理员权限
// 3. `verildatot`：验证商品数据的合法性
// 4. `update`：调用控制器方法更新商品
router.put("/:id", auth, verifAdmin, verildatot, update);

// 路由：删除商品
// POST /goods/:id/off
// 中间件顺序：
// 1. `auth`：认证用户，确保请求者已登录
// 2. `hadAdminPermission`：检查用户是否具有管理员权限
// 3. `removal`：调用控制器方法删除商品
router.post("/:id/off", auth, verifAdmin, removal);

// 路由：恢复删除的商品
// POST /goods/:id/on
// 中间件顺序：
// 1. `auth`：认证用户，确保请求者已登录
// 2. `hadAdminPermission`：检查用户是否具有管理员权限
// 3. `restore`：调用控制器方法恢复商品
router.post("/:id/on", auth, verifAdmin, restore);

// 路由：获取所有商品
// GET /goods/
// 中间件顺序：
// 1. 无需额外中间件
// 2. `findAll`：调用控制器方法获取商品列表
router.get("/", findAll);

// 导出路由模块
module.exports = router;

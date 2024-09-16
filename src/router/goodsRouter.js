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
  findAllRemoval,
  findAllSearch,
} = require("../controller/goodsController");

// 实例化路由，并设置前缀为 '/goods'
const router = new Router({ prefix: "/goods" });

// 路由：创建商品
router.post("/", auth, verifAdmin, verildatot, create);

// 路由：更新商品信息
router.put("/:id",verildatot, auth, verifAdmin, update);

// 路由：删除商品
router.post("/off", auth, verifAdmin, removal);

// 路由：恢复删除的商品
router.post("/on", auth, verifAdmin, restore);

// 路由：获取所有商品
router.get("/", findAll);

// 路由：获取所有删除的商品
router.post("/removal", auth, verifAdmin, findAllRemoval);

// 路由：商品搜索
router.get("/search", findAllSearch);
// 导出路由模块
module.exports = router;

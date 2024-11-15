// 引入 Koa 路由
const Router = require("koa-router");

// 引入认证和权限中间件
const { auth, verifAdmin } = require("../middleware/authMiddleware");

const { validateParams } = require("../middleware/genericMiddleware");

// 引入商品控制器方法
const {
  create,
  update,
  removal,
  restore,
  findAll,
  findAllRemoval,
  getProductSearch,
  queryNewGoods,
  querySalesGoods,
  getProduct,
} = require("../controller/goodsController");
const { goodsFormatRules } = require("../constant/rules");
const { goodsUpdateError } = require("../constant/errType");
// 实例化路由
const router = new Router({ prefix: "/goods" });

// 路由：创建商品
router.post(
  "/",
  validateParams(goodsFormatRules, goodsUpdateError),
  auth,
  verifAdmin,
  create
);

// 路由：更新商品信息
router.put(
  "/:id",
  validateParams(goodsFormatRules, goodsUpdateError),
  auth,
  verifAdmin,
  update
);

// 路由：删除商品
router.post("/off", auth, verifAdmin, removal);

// 路由：恢复删除的商品
router.post("/on", auth, verifAdmin, restore);

// 路由：获取所有删除的商品
router.post("/removal", auth, verifAdmin, findAllRemoval);

// 路由：获取所有商品
router.get("/", findAll);

// 路由：获取一个商品
router.get("/product", getProduct);

// 路由：商品搜索
router.get("/search_goods", getProductSearch);

// 新品
router.get("/new_goods", queryNewGoods);

// 商品销售量排序
router.get("/sales_goods", querySalesGoods);

module.exports = router;

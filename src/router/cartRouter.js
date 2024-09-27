const Router = require("koa-router");
// 引入中间件
const { validateParams } = require("../middleware/genericMiddleware");
const { auth } = require("../middleware/authMiddleware"); // 认证用户
// 引入控制器方法
const {
  addCart,
  findAll,
  update,
  remove,
  selectALll,
} = require("../controller/cartController");

const { cartFormatError } = require("../constant/errType");

// 实例化路由，并设置前缀为 '/carts'
const router = new Router({ prefix: "/cart" });

// 路由：添加商品到购物车
router.post("/add", auth, addCart);

// 路由：获取用户的购物车列表
router.get("/", auth, findAll);

// 路由：更新购物车中的商品
router.patch(
  "/:id",
  auth,
  validateParams(
    {
      number: { type: "number", required: false },
      selected: { type: "bool", required: false },
    },
    cartFormatError
  ),
  update
);

// 路由：删除购物车中的商品
router.post("/remove", auth, remove);

// 路由：购物车全选
router.post("/selectAll", auth, selectALll);

// 导出路由模块
module.exports = router;

const Router = require("koa-router");
// 引入中间件
const { validateParams } = require("../middleware/genericMiddleware");
const { auth } = require("../middleware/authMiddleware"); // 认证用户
// 引入控制器方法
const {
  addCart,
  findAll,
  updateOneNumber,
  updateOneChecke,
  remove,
  selectALll,
} = require("../controller/cartController");

const { cartFormatError } = require("../constant/errType");

const router = new Router({ prefix: "/cart" });

router.post(
  "/add",
  validateParams({ goods_id: { type: "integer", required: true } }),
  auth,
  addCart
);

router.get("/", auth, findAll);

router.patch(
  "/check/:id",
  validateParams(
    { selected: { type: "bool", required: true } },
    cartFormatError
  ),
  auth,
  updateOneChecke
);

router.patch(
  "/number/:id",
  validateParams(
    {
      number: { type: "number", required: true },
    },
    cartFormatError
  ),
  auth,
  updateOneNumber
);

router.post(
  "/remove",
  // validateParams({ type: "array", itemType: "number" }),
  auth,
  remove
);

router.post("/selectAll", auth, selectALll);

module.exports = router;

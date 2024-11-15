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
const {
  cartFormatRules,
  cartSelectRules,
  cartNumberRules,
  cartDeleteRules,
} = require("../constant/rules");
const router = new Router({ prefix: "/cart" });

router.post(
  "/add",
  validateParams(cartFormatRules, cartFormatError),
  auth,
  addCart
);

router.get("/", auth, findAll);

router.patch("/check", auth, updateOneChecke);

router.patch(
  "/number/:id",
  validateParams(cartNumberRules, cartFormatError),
  auth,
  updateOneNumber
);

router.post(
  "/remove",
  validateParams(cartDeleteRules, cartFormatError),
  auth,
  remove
);

router.post("/selectAll", auth, selectALll);

module.exports = router;

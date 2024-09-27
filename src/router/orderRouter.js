const Router = require("koa-router");
const { auth } = require("../middleware/authMiddleware"); // 认证用户
const { validateParams } = require("../middleware/genericMiddleware");
const {
  create,
  findAllOrder,
  deleteOrder,
  updateStatus,
  search,
  getOneOrder,
} = require("../controller/orderController");
const { orderInfoRules } = require("../constant/rules");
const { orderFormError } = require("../constant/errType");

const router = new Router({ prefix: "/order" });

router.post(
  "/create",
  validateParams(orderInfoRules, orderFormError),
  auth,
  create
);

router.post("/", auth, findAllOrder);
router.delete("/:id", auth, deleteOrder);
router.post("/search", auth, search);
router.get("/:id", auth, getOneOrder);
router.patch("/:id", auth, updateStatus);
module.exports = router;

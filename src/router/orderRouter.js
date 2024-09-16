const Router = require("koa-router");
const { auth, verifAdmin } = require("../middleware/authMiddleware"); // 认证用户
const { verildatot } = require("../middleware/genericMiddleware");
const {
  create,
  findAllOrder,
  deleteOrder,
  updateStatus,
  search,
  findAllOrderAddress,
} = require("../controller/orderController");
const { orderInfoRules } = require("../constant/rules");
const { creatOrderError } = require("../constant/errType");

const router = new Router({ prefix: "/order" });

router.post(
  "/create",
  // verildatot(orderInfoRules, creatOrderError),
  auth,
  create
);
router.post("/", auth, findAllOrder);
router.delete("/:id", auth, deleteOrder);
router.patch("/:id", auth, updateStatus);
router.post("/search", auth, search);
router.post("/all", auth, verifAdmin, findAllOrderAddress);
module.exports = router;

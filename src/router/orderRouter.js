const Router = require("koa-router");
const { auth,verifAdmin } = require("../middleware/authMiddleware"); // 认证用户
const { verildatot } = require("../middleware/genericMiddleware");
const { verifyDefaultAddress } = require("../middleware/addressMiddleware");
const { verifyOrderInGoods } = require("../middleware/orderMiddleware");
const {
  create,
  findAllOrder,
  deleteOrder,
  updateStatus,
  search,
  findAllOrderAddress
} = require("../controller/orderController");
const { goodsInfoRules } = require("../constant/rules");
const { creatOrderError } = require("../constant/errType");


const router = new Router({ prefix: "/order" });

router.post(
  "/create",
  verildatot(goodsInfoRules, creatOrderError),
  auth,
  verifyOrderInGoods,
  verifyDefaultAddress,
  create
);
router.post("/", auth, findAllOrder);
router.delete("/:id", auth, deleteOrder);
router.patch("/:id", auth, updateStatus);
router.post("/search", auth, search);
router.post("/all", auth,verifAdmin, findAllOrderAddress);
module.exports = router;

const Router = require("koa-router");
const { auth } = require("../middleware/authMiddleware"); // 认证用户
const { verildatot } = require("../middleware/genericMiddleware");
const {verifyDefaultAddress} =require('../middleware/addressMiddeware')
const {
  create,
  findAllOrder,
  deleteOrder,
} = require("../controller/orderController");
const { goodsInfoRules } = require("../constant/rules");
const { creatOrderError } = require("../constant/errType");

const router = new Router({ prefix: "/order" });

router.post(
  "/create",
  verildatot(goodsInfoRules, creatOrderError),
  auth,
  verifyDefaultAddress,
  create
);
router.post("/", auth, findAllOrder);
router.delete("/:id", auth, deleteOrder);
module.exports = router;

const Router = require("koa-router");
const { auth } = require("../middleware/authMiddleware"); // 认证用户
const { verildatot } = require("../middleware/genericMiddleware");
const {
  create,
  findAllOrder,
  deleteOrder,
} = require("../controller/orderController");
const router = new Router({ prefix: "/order" });

router.post("/create", auth, create);
router.post("/", auth, findAllOrder);
router.delete("/:id", auth, deleteOrder);
module.exports = router;

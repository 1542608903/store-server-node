const Router = require("koa-router");
const { auth, verifAdmin } = require("../middleware/authMiddleware");
const {
  getUserStatistics,
  getGoodsStatistics,
  getOrderStatistics,
} = require("../controller/statistics");

const router = new Router({ prefix: "/tj" });

router.post("/user-count", auth, verifAdmin, getUserStatistics);
router.post("/goods-count", auth, verifAdmin, getGoodsStatistics);
router.post("/order-count", auth, verifAdmin, getOrderStatistics);
module.exports = router;

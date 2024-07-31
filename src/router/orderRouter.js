const Router = require("koa-router");
const { auth } = require("../middleware/authMiddleware"); // 认证用户
const { verildatot } = require("../middleware/genericMiddleware");
const { create } = require("../controller/orderController");
const router = new Router({ prefix: "/order" });

router.post("/create",auth,verildatot({
    goods_info:{
    }
}), create);

module.exports = router;

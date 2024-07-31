const Router = require("koa-router");
const {
  create,
  findAll,
  update,
  isOnDefault,
} = require("../controller/addressController");
const { verildatot } = require("../middleware/genericMiddleware");
const { auth } = require("../middleware/authMiddleware"); // 认证用户

const { addressFormatError } = require("../constant/errType");

// 实例化路由，并设置前缀为 '/address'
const router = new Router({ prefix: "/address" });

router.post(
  "/",
  auth,
  verildatot(
    {
      consignee: { type: "string" },
      phone: { type: "string", format: /^1[3-9]\d{9}$|^0\d{2,3}-\d{7,8}$/ },
      address: { type: "string" },
    },
    addressFormatError
  ),
  create
);
router.post("/findAll", auth, findAll);
router.put(
  "/",
  auth,
  verildatot({
    id: { type: "number" },
    consignee: { type: "string" },
    phone: { type: "string" },
    address: { type: "string" },
  }),
  update
);
router.post("/on", auth, isOnDefault);
router.post("/off", auth, isOnDefault);

module.exports = router;

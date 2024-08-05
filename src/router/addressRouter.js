const Router = require("koa-router");
const {
  create,
  findAll,
  update,
  isOnDefault,
  deleteAddress,
} = require("../controller/addressController");
const { verildatot } = require("../middleware/genericMiddleware");
const { auth } = require("../middleware/authMiddleware"); // 认证用户
const { verifyDefaultAddress } = require("../middleware/addressMiddleware");
const { addressFormatError } = require("../constant/errType");
const { addressFormatRoles } = require("../constant/rules");

// 实例化路由，并设置前缀为 '/address'
const router = new Router({ prefix: "/address" });

router.post(
  "/",
  auth,
  // verildatot(addressFormatRoles, addressFormatError),
  create
);
router.post("/findAll", auth, findAll);
router.put(
  "/",
  verildatot(addressFormatRoles, addressFormatError),
  auth,
  verifyDefaultAddress,
  update
);

router.post("/on", auth, verifyDefaultAddress, isOnDefault);
router.post("/off", auth, verifyDefaultAddress, isOnDefault);
router.delete("/:id", auth, deleteAddress);

module.exports = router;
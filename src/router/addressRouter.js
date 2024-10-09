const Router = require("koa-router");
const {
  create,
  findAll,
  update,
  isOnDefault,
  deleteAddress,
  queryAddress,
} = require("../controller/addressController");
const { validateParams } = require("../middleware/genericMiddleware");
const { auth } = require("../middleware/authMiddleware"); // 认证用户
const { verifyDefaultAddress } = require("../middleware/addressMiddleware");
const { addressFormatError } = require("../constant/errType");
const { addressFormatRoles } = require("../constant/rules");

// 实例化路由，并设置前缀为 '/address'
const router = new Router({ prefix: "/address" });

router.get("/query",auth ,queryAddress);

router.post(
  "/",
  validateParams(addressFormatRoles, addressFormatError),
  auth,
  create
);

router.post("/findAll", auth, findAll);

router.put(
  "/",
  validateParams(addressFormatRoles, addressFormatError),
  auth,
  verifyDefaultAddress,
  update
);

router.post("/update_default", auth, isOnDefault);

router.delete("/:id", auth, deleteAddress);

module.exports = router;

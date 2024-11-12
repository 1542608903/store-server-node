const Router = require("koa-router");
const {
  create,
  findAll,
  update,
  isOnDefault,
  deleteAddress,
  queryAddress,
  getAreas,
} = require("../controller/addressController");
const { validateParams } = require("../middleware/genericMiddleware");
const { auth } = require("../middleware/authMiddleware"); // 认证用户
const { addressFormatError } = require("../constant/errType");
const { addressFormatRules } = require("../constant/rules");

// 实例化路由，并设置前缀为 '/address'
const router = new Router({ prefix: "/address" });

router.get("/query", auth, queryAddress);

router.post(
  "/",
  validateParams(addressFormatRules, addressFormatError),
  auth,
  create
);

router.post("/findAll", auth, findAll);

router.post(
  "/edit",
  validateParams(addressFormatRules, addressFormatError),
  auth,
  update
);

router.post("/update_default", auth, isOnDefault);

router.delete("/:id", auth, deleteAddress);

router.get("/areas", getAreas);

module.exports = router;

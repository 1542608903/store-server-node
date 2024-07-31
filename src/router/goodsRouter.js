// 引入 Koa 路由
const Router = require("koa-router");
const { upload } = require("../upload");
const fileValidator = require("../middleware/fileValidator");
const { auth, hadAdminPermission } = require("../middleware/authMiddleware");
const { verildatot } = require("../middleware/goodsMiddleware");
const {
  create,
  update,
  removal,
  restore,
  findAll,
} = require("../controller/goodsController");
const { UPLOAD_TYPE } = require("../config/config.default");

// 实例化路由，并设置前缀为 '/goods'
const router = new Router({ prefix: "/goods" });

router.post(
  "/upload",
  auth,
  hadAdminPermission,
  fileValidator(UPLOAD_TYPE),
  upload
);
router.post("/", auth, hadAdminPermission, verildatot, create);
router.put("/:id", auth, hadAdminPermission, verildatot, update);
// router.delete('/:id',auth,hadAdminPermission,remove);
router.post("/:id/off", auth, hadAdminPermission, removal);
router.post("/:id/on", auth, hadAdminPermission, restore);
router.get("/", findAll);
// 导出路由模块
module.exports = router;

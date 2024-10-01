const Router = require("koa-router");
const { upload } = require("../controller/uploadController");
const { auth } = require("../middleware/authMiddleware");
const {
  fileTypeValidator,
} = require("../middleware/uploadMiddleware");

const router = new Router({ prefix: "/upload" });

router.post("/", auth, fileTypeValidator, upload);

module.exports = router;

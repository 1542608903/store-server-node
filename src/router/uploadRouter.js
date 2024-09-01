const Router = require("koa-router");
const { FILE_TYPE } = require("../config/config.default");
const { upload } = require("../controller/uploadController");
const { auth } = require("../middleware/authMiddleware");
const { fileValidator } = require("../middleware/uploadMiddleware");


const router = new Router({ prefix: "/upload" });

router.post("/", auth, fileValidator(FILE_TYPE), upload);

module.exports = router;

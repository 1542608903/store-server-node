const Router = require("koa-router");
const { UPLOAD_TYPE } = require("../config/config.default");
const { upload } = require("../upload");
const { auth, hadAdminPermission } = require("../middleware/authMiddleware");
const {fileValidator} =require('../middleware/uploadMiddleware')
const router = new Router({prefix:"/upload"});

router.post("/", auth, fileValidator(UPLOAD_TYPE), upload);


module.exports = router
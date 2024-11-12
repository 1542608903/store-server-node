const Router = require("koa-router");
const { createCaptcha } = require("../utils/captcha");
const router = new Router({ prefix: "/captcha" });

router.get("/code", createCaptcha);

module.exports = router;

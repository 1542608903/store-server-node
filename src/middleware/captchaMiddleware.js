const { delKey, getData } = require("../utils/redis");
const { verifyCaptcha } = require("../utils/captcha");
const { captchaLose, captchaError } = require("../constant/errType");
const validateCaptcha = async (ctx, next) => {
  try {
    const { codeKey, code: userCode } = ctx.request.body;

    // 验证码键和用户输入验证码不能为空的检查
    if (!codeKey && userCode) {
      return (ctx.body = {
        code: 0,
        message: "请输入验证码",
        result: "",
      });
    }

    // 获取 Redis 中的验证码
    const serverCode = await getData(codeKey);

    // 如果验证码已过期或不存在
    if (!serverCode) {
      ctx.app.emit("error", captchaLose, ctx);
      return;
    }

    // 比较验证码
    if (verifyCaptcha(serverCode, userCode)) {
      // 验证成功，删除验证码
      await delKey(codeKey);
      await next();
    } else {
      await delKey(codeKey);
      ctx.app.emit("error", captchaError, ctx);
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { validateCaptcha };

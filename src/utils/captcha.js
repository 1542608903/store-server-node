const svgCaptcha = require("svg-captcha");
const { setData } = require("../utils/redis");
const UUID = require("./uuid");

// const createCaptcha = async (ctx) => {
//   const { width, height, color, noise, ignoreChars, size } = ctx.request.body;

//   const captcha = svgCaptcha.create({
//     size: size || 4,
//     ignoreChars: ignoreChars || "0oli9quv",
//     noise: noise || 3,
//     color: color || true,
//     width: width || 150,
//     height: height || 60,
//   });

//   const captchaKey = `captcha:${UUID()}`;
//   await setData(captchaKey, captcha.text, 60);

//   return (ctx.body = {
//     code: 0,
//     message: "验证码",
//     result: {
//       codeKey: captchaKey,
//       code: captcha.data,
//     },
//   });
// };

const createCaptcha = async (ctx) => {
  try {
    // 从请求中获取参数，设置默认值
    const { width, height, color, noise, ignoreChars, size } =
      ctx.request.body || {};
    // 验证输入参数的有效性（简单校验，可以根据需求进一步扩展）
    const validWidth = parseInt(width) || 150;
    const validHeight = parseInt(height) || 60;
    const validSize = parseInt(size) || 4;
    const validNoise = parseInt(noise) || 3;
    const validIgnoreChars = ignoreChars || "0oli9quv";
    const validColor = color || true;

    // 使用 svgCaptcha 创建验证码
    const captcha = svgCaptcha.create({
      size: validSize,
      ignoreChars: validIgnoreChars,
      noise: validNoise,
      color: validColor,
      width: validWidth,
      height: validHeight,
    });

    // 生成一个唯一的验证码存储 key
    const captchaKey = `captcha:${UUID()}`;

    // 将验证码文本存储到缓存中，设置过期时间为 60 秒
    await setData(captchaKey, captcha.text, 60);

    // 返回生成的验证码信息
    return (ctx.body = {
      code: 0,
      message: "验证码生成成功",
      result: {
        codeKey: captchaKey,
        code: captcha.data,
      },
    });
  } catch (error) {
    return (ctx.body = {
      code: 1,
      message: "验证码生成失败，请稍后再试",
    });
  }
};

/**
 *
 * @param {string} serverCode 服务器的验证码
 * @param {string} userCode 用户输入的验证码
 */
const verifyCaptcha = (serverCode, userCode) => {
  try {
    if (serverCode.toLowerCase() !== userCode.toLowerCase()) {
      console.log("验证码错误");

      return false;
    } else {
      return true;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { createCaptcha, verifyCaptcha };

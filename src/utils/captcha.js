const svgCaptcha = require("svg-captcha");
const { setData } = require("../utils/redis");
const UUID = require("./uuid");

const createCaptcha = async (ctx) => {
  const captcha = svgCaptcha.create({
    size: 4,
    ignoreChars: "0oli9quv", //排除字符
    noise: 3,
    color: true,
    width: 150,
    height: 60,
  });

  const captchaKey = `captcha:${UUID()}`;
  await setData(captchaKey, captcha.text, 60);

  return (ctx.body = {
    code: 0,
    message: "验证码",
    result: {
      codeKey: captchaKey,
      code: captcha.data,
    },
  });
};

/**
 *
 * @param {string} serverCode 服务器的验证码
 * @param {string} userCode 用户输入的验证码
 */
const verifyCaptcha = (serverCode, userCode) => {
  try {
    if (serverCode.toLowerCase() !== userCode.toLowerCase()) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { createCaptcha, verifyCaptcha };

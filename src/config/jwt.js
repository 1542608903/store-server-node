const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config.default"); // 从配置文件中获取密钥
const { convertToSeconds } = require("../utilst/convertToSeconds");

/**
 * 生成短期访问令牌
 * @param {Object} user - 用户信息对象
 * @param {string|number} times - 可选令牌过期时间(默认一天)
 * @returns {Promise<Object>} - 返回生成的短期访问令牌和过期时间戳
 */
const setAccessToken = async (user, times = "1d") => {
  // 计算过期时间的时间戳
  const currentTime = Math.floor(Date.now() / 1000); // 当前时间的时间戳（秒）
  const expiresIn = convertToSeconds(times);

  const expiryTimestamp = currentTime + expiresIn;

  // 使用jwt.sign生成短期访问令牌，并指定过期时间
  const token = jwt.sign(user, JWT_SECRET, { expiresIn });

  return { token, expiryTimestamp };
};

/**
 * 生成长期刷新令牌
 * @param {Object} user - 用户信息对象
 * @param {string|number} times - 令牌过期时间
 * @returns {Promise<string>} - 返回生成的长期刷新令牌
 */
const setRefreshToken = async (user, times) => {
  // 使用jwt.sign生成长期刷新令牌，并指定过期时间
  return jwt.sign(user, JWT_SECRET, { expiresIn: convertToSeconds(times) });
};

module.exports = {
  setAccessToken, // 导出生成短期访问令牌的函数
  setRefreshToken, // 导出生成长期刷新令牌的函数
};

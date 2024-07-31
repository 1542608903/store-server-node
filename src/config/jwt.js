const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config.default"); // 从配置文件中获取密钥

/**
 * 生成短期访问令牌
 * @param {Object} user - 用户信息对象
 * @param {string|number} times - 令牌过期时间
 * @returns {Promise<string>} - 返回生成的短期访问令牌
 */
const setAccessToken = async (user, times) => {
  // 使用jwt.sign生成短期访问令牌，并指定过期时间
  return jwt.sign(user, JWT_SECRET, { expiresIn: times });
};

/**
 * 生成长期刷新令牌
 * @param {Object} user - 用户信息对象
 * @param {string|number} times - 令牌过期时间
 * @returns {Promise<string>} - 返回生成的长期刷新令牌
 */
const setRefreshToken = async (user, times) => {
  // 使用jwt.sign生成长期刷新令牌，并指定过期时间
  return jwt.sign(user, JWT_SECRET, { expiresIn: times });
};

module.exports = {
  setAccessToken, // 导出生成短期访问令牌的函数
  setRefreshToken, // 导出生成长期刷新令牌的函数
};

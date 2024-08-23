const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config.default"); // 从配置文件中获取密钥

/**
 * 生成访问令牌
 * @param {Object} user - 用户信息对象
 * @param {string|number} times - 可选令牌过期时间(默认20分钟)
 * @returns   - 返回生成的访问令牌
 */
const createToken = async (user, times = 20 * 60) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: times });
};

/**
 *
 * @param {string} token 用户携带的
 * @param {string} secret 系统设置的
 * @returns
 */
const verifySecret = async (token, secret) => {
  return jwt.verify(token, secret);
};

// 创建token方法

module.exports = {
  createToken,
  verifySecret,
};

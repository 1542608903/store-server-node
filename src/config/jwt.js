const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config.default"); // 从配置文件中获取密钥
/**
 * 生成访问令牌
 * @param {Object} user - 用户信息对象
 * @param {string|number} times - 可选令牌过期时间(默认20分钟)
 * @returns   - 返回生成的访问令牌
 */

const createToken = async (user, times = "10s") => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: times });
};

/**
 *
 * @param {string} token 用户携带的
 * @returns {object} -- { ...user, valid: boolean}
 */
const verifyToken = (token) => {
  const user = jwt.verify(token, JWT_SECRET);
  return { ...user, valid: true };
};

module.exports = {
  createToken,
  verifyToken,
};

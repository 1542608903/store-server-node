const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config.default"); // 从配置文件中获取密钥

/**
 * 生成访问令牌
 * @param {Object} user 用户信息对象
 * @param {string|number} expiresIn 可选令牌过期时间(默认1h)
 * @returns 返回生成的访问令牌
 */
const createToken = (user, expiresIn = "1h") => {
  const payload = {
    id: user.id, // 用户ID
    name: user.user_name, // 用户账号
    iat: Math.floor(Date.now() / 1000), // 当前时间戳
  };
  // JWT令牌
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
  return token;
};

/**
 *令牌验证
 * @param {string} token 用户令牌
 * @returns 返回用户对象
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createToken,
  verifyToken,
};

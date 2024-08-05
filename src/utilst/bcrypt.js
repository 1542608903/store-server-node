const bcrypt = require("bcrypt");

/**
 * 生成哈希密码
 * @param {string} password - 明文密码
 * @returns {Promise<string>} - 返回哈希密码
 */
const hashPassword = async (password, saltRounds = 10) => {
  try {
    // 定义盐的轮次
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error("邮箱重复");
  }
};

/**
 * 验证密码
 * @param {string} password - 明文密码
 * @param {string} hashedPassword - 哈希密码
 * @returns {Promise<boolean>} - 返回密码验证结果
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw new Error("验证密码时出错");
  }
};

module.exports = { comparePassword, hashPassword };

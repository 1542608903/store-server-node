const { v4: uuidv4 } = require("uuid");

/**
 * UUID
 * 使用方法UUID( )
 * @returns 
 */
const UUID = () => {
  return uuidv4();
};

module.exports = UUID;

/**
 * 封装统一的响应体
 * @param {Object} ctx - Koa 上下文
 * @param {number} code - 响应的状态码
 * @param {string} message - 响应的提示信息
 * @param {Object | Array} data - 返回的数据
 */
const sendResponse = (ctx, code, message, data) => {
  ctx.body = {
    code,
    message,
    result: {
      url: data?.length === 1 ? data[0] : data,
    },
  };
};

module.exports = sendResponse;

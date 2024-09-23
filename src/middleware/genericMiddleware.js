/**
 * 通用校验数据类型中间件
 * @param {object} customRules -- 传入校验对象类型 必选
 * @param {object} customErrType -- 传入错误对象类型 必选
 */
const validateParams = (customRules, customErrType) => {
  return async (ctx, next) => {
    try {
      // 验证 customRules 的有效性
      if (!customRules || typeof customRules !== 'object') {
        throw new Error('Invalid customRules: It must be an object.');
      }

      // 进行参数校验
      ctx.verifyParams(customRules);

      // 校验通过，继续执行下一个中间件
      await next();
    } catch (err) {
      console.error("Validation error:", err);

      // 检查 err 是否包含额外的验证错误信息
      const errorDetails = err.errors || err.message || "Parameter validation failed";

      // 将错误信息传递给全局错误处理器
      ctx.app.emit("error", { ...customErrType, details: errorDetails }, ctx);
    }
  };
};

module.exports = {
  validateParams,
};

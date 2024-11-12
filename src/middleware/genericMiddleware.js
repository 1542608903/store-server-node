/**
 * 通用校验数据类型中间件
 * @param {object} customRules -- 传入校验对象类型 必选
 * @param {object} customErrType -- 传入错误对象类型 必选
 */
const validateParams = (customRules, customErrType) => {
  return async (ctx, next) => {
    try {
      if (!customRules || typeof customRules !== "object") {
        throw new Error("Invalid customRules: It must be an object.");
      }

      ctx.verifyParams(customRules);

      await next();
    } catch (err) {
      const errorDetails =
        err.errors || err.message || "Parameter validation failed";
      ctx.app.emit("error", { ...customErrType, result: errorDetails }, ctx);
    }
  };
};

module.exports = {
  validateParams,
};

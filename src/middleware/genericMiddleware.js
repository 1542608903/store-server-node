/**
 * 通用校验数据类型中间件
 * @param {object} customRules --传入校验对象类型 必选
 * @param {object} customErrType --传入错误对象类型 必选
 */
const verildatot = (customRules, customErrType) => {
  return async (ctx, next) => {
    try {
      ctx.verifyParams(customRules);
      await next();
    } catch (err) {
      console.error("error", err);
      return ctx.app.emit("error", customErrType, ctx);
    }
  };
};

module.exports = {
  verildatot,
};

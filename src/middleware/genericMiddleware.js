
/**
 * 通用校验数据类型中间件
 * @param {object} rules --传入校验对象类型 必选
 * @param {object} errType --传入错误对象类型 必选
 */
const verildatot = (rules,errType) => {
  return async (ctx, next) => {
    try {
      ctx.verifyParams(rules);
      await next();
    } catch (err) {
      console.error("error", err);
      errType.result = err;
      return ctx.app.emit("error", errType, ctx);
    }
  };
};
module.exports = {
  verildatot,
};

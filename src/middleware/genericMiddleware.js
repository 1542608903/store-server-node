const Parameter = require("parameter");
const parameter = new Parameter();

/**
 * 通用校验数据类型中间件
 * @param {object} customRules -- 传入校验对象类型 必选
 * @param {object} customErrType -- 传入错误对象类型 必选
 */
// const validateParams = (customRules, customErrType) => {
//   return async (ctx, next) => {
//     try {
//       if (!customRules || typeof customRules !== "object") {
//         throw new Error("无效的 customRules：它必须是一个对象。");
//       }
//       if (!customErrType || typeof customErrType !== "object") {
//         throw new Error("无效的 customErrType：它必须是一个对象。");
//       }

//       // 参数转换为数字
//       if (ctx.params.id) {
//         ctx.params.id = parseInt(ctx.params.id);
//       }
//       if (ctx.query.id) {
//         ctx.query.id = parseInt(ctx.query.id);
//       }
//       if (ctx.request.body.id) {
//         ctx.request.body.id = parseInt(ctx.request.body.id);
//       }

//       // 执行参数验证
//       ctx.verifyParams(customRules);
//       await next();
//     } catch (error) {
//       console.log(error);
//       ctx.app.emit("error", { ...customErrType, message: "server error" }, ctx);
//     }
//   };
// };
const validateParams = (customRules, customErrType) => {
  return async (ctx, next) => {
    try {
      // 检查传入的规则是否合法
      if (!customRules || typeof customRules !== "object") {
        throw new Error("无效的 customRules：它必须是一个对象。");
      }
      if (!customErrType || typeof customErrType !== "object") {
        throw new Error("无效的 customErrType：它必须是一个对象。");
      }

      if (ctx.params.id) {
        ctx.params.id = parseInt(ctx.params.id);
      }
      if (ctx.query.id) {
        ctx.query.id = parseInt(ctx.query.id);
      }

      const data = {
        ...ctx.query,
        ...ctx.request.body,
        ...ctx.params,
      };
      // 结合路径参数、查询参数和请求体参数进行验证
      const error = parameter.validate(customRules, data);

      // 如果验证失败，抛出自定义错误
      if (error) {
        const errorMessage = error;
        throw new Error(errorMessage);
      }

      // 验证通过后，继续执行下一个中间件
      await next();
    } catch (error) {
      console.log("参数验证失败", error);
      // 触发自定义错误处理
      ctx.app.emit(
        "error",
        { ...customErrType, message: error.message || "参数验证失败" },
        ctx
      );
    }
  };
};

module.exports = {
  validateParams,
};

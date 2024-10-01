const path = require("path");
const Koa = require("koa");
const parameter = require("koa-parameter");
const { koaBody } = require("koa-body");
const KoaStatic = require("koa-static");
const errHandler = require("./errHandler");
const router = require("../router");
const { UPLOAD_TYPE } = require("../config/config.default");
const Model = require("../model/index");
const app = new Koa();
// 类型校验工具
app.use(parameter(app));
// 上传配置
switch (UPLOAD_TYPE) {
  case "local":
    app.use(
      koaBody({
        multipart: true,
        formidable: {
          uploadDir: path.join(__dirname, "../public/local"),
          keepExtensions: true,
          maxFieldsSize: 2 * 1024 * 1024,
        },
        parsedMethods: ["POST", "PUT", "PATCH", "DELETE"],
      })
    );
    break;
  case "online":
    app.use(
      koaBody({
        multipart: true,
        formidable: {
          uploadDir: path.join(__dirname, "../public/online"),
          keepExtensions: true,
          maxFieldsSize: 2 * 1024 * 1024,
        },
      })
    );
    break;
  default:
    app.use(
      koaBody({
        multipart: true,
        formidable: {
          uploadDir: path.join(__dirname, "../public/minio"),
          keepExtensions: true,
          maxFieldsSize: 2 * 1024 * 1024,
        },
      })
    );
    break;
}

// 静态文件服务配置
app.use(KoaStatic(path.join(__dirname, "../public/")));

// 路由中间件
app.use(router.routes()).use(router.allowedMethods());

// 全局错误处理
app.on("error", errHandler);

// 导出服务器而不是 Koa 实例
module.exports = { app };

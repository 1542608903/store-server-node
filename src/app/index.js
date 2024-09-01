const path = require("path");
const Koa = require("koa");
const { koaBody } = require("koa-body");
const KoaStatic = require("koa-static");
const errHandler = require("./errHandler");
const router = require("../router");
const parameter = require("koa-parameter");
const { UPLOAD_TYPE } = require("../config/config.default"); // 上传类型

// 创建实例
const app = new Koa();

console.log("上传模式:", UPLOAD_TYPE);

switch (UPLOAD_TYPE) {
  case "local":
    // 文件上传local配置
    app.use(
      koaBody({
        multipart: true,
        formidable: {
          uploadDir: path.join(__dirname, "../public/local"), // 确保这个目录存在且应用有权限写入
          keepExtensions: true, // 保持文件扩展名
          maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        },
        parsedMethods: ["POST", "PUT", "PATCH", "DELETE"],
      })
    );
    break;
  case "online":
    // 上传到服务器
    app.use(
      koaBody({
        multipart: true, // 支持文件上传
        formidable: {
          uploadDir: path.join(__dirname, "../public/online"), // 设置文件上传目录
          keepExtensions: true, // 保持文件的后缀
          maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        },
      })
    );
    break;
  case "minio":
    app.use(
      koaBody({
        multipart: true, // 支持文件上传
        formidable: {
          keepExtensions: true, // 保持文件扩展名
          maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
        },
      })
    );
    break;
}

// 静态文件服务配置
// ../public/目录下的所有文件
app.use(KoaStatic(path.join(__dirname, "../public/")));

app.use(parameter(app));

// 路由中间件
app.use(router.routes()).use(router.allowedMethods());

// 全局错误处理
app.on("error", errHandler);

module.exports = app;

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
const { connectRedis } = require("../utils/redis");

// 连接redis
connectRedis();

// 静态资源
app.use(KoaStatic(path.join(__dirname, "../public")));
// 上传配置

// switch (UPLOAD_TYPE) {
//   case "local":
//     app.use(
//       koaBody({
//         multipart: true,
//         formidable: {
//           // 上传文件目录
//           uploadDir: path.join(__dirname, "../public/local"),
//           // 保留文件扩展名
//           keepExtensions: true,
//           // 文件大小是 2M
//           maxFieldsSize: 2 * 1024 * 1024,
//         },
//         parsedMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//       })
//     );
//     break;
//   case "online":
//     app.use(
//       koaBody({
//         multipart: true,
//         formidable: {
//           // 上传文件目录
//           uploadDir: path.join(__dirname, "../public/online"),
//           // 保留文件扩展名
//           keepExtensions: true,
//           // 文件大小是 2M
//           maxFieldsSize: 2 * 1024 * 1024,
//         },
//       })
//     );
//     break;
//   default:
//     app.use(
//       koaBody({
//         multipart: true,
//         formidable: {
//           // 上传文件目录
//           uploadDir: path.join(__dirname, "../public/minio"),
//           // 保留文件扩展名
//           keepExtensions: true,
//           // 文件大小是 2M
//           maxFieldsSize: 2 * 1024 * 1024,
//         },
//       })
//     );
//     break;
// }
// 上传配置
app.use(
  koaBody({
    multipart: true,
    formidable: {
      // 上传文件目录，根据 UPLOAD_TYPE 设置
      uploadDir: path.join(
        __dirname,
        `../public/${UPLOAD_TYPE === "local" ? "local" : "online"}`
      ),
      // 保留文件扩展名
      keepExtensions: true,
      // 文件大小限制 2MB
      maxFieldsSize: 5 * 1024 * 1024,
    },
    parsedMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// 类型校验工具
app.use(parameter(app));

// 路由配置
app.use(router.routes()).use(router.allowedMethods());

// 全局错误处理
app.on("error", errHandler);

module.exports = { app };

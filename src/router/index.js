const fs = require("fs");
const Router = require("koa-router");

const router = new Router();

// 读取当前目录中的所有文件
fs.readdirSync(__dirname).forEach((file) => {
  // 排除 index.js 文件
  if (file !== "index.js") {
    // 动态加载路由文件
    let r = require("./" + file);
    if (typeof r.routes == "undefined") {
      return console.error("请导出路由", r);
    }
    // 使用加载的路由文件中的路由
    router.use(r.routes());
  }
});

// 导出配置好的路由实例
module.exports = router;

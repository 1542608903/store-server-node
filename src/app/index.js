const path = require('path');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const KoaStatic = require('koa-static');
const errHandler = require('./errHandler');
const router = require('../router');
const parameter = require('koa-parameter')
const app = new Koa();

// 文件上传配置
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '../upload/online'), // 确保这个目录存在且应用有权限写入
        keepExtensions: true, // 保持文件扩展名
    }
}));

// 静态文件服务配置
app.use(KoaStatic(path.join(__dirname, '../upload/online')));

app.use(parameter(app))
// 路由中间件
app.use(router.routes()).use(router.allowedMethods());

// 全局错误处理
app.on('error', errHandler);

module.exports = app;

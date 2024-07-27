# 一、项目初始化
- npm初始化`npm init -y`
  
- 安装Koa`npm i koa`

- 创建入口文件`main.ts`
```
const Koa = require('koa');
const app = new Koa()

app.use((ctx:any) => {
    ctx.body = 'hello Koa';
})
//创建监听端口
app.listen(3000, () => {
    return console.log('http://127.0.0.1:3000/');
}); 
```
- 配置`package.json`
```
  "scripts": {
    "dev":"nodemon ./src/main.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
- 启动服务`npm run dev`
- 读取配置文件 `npm i dotenv`
- 创建env文件和添加对应变量
- 创建`config.default.js`
```
// config.default.js
//引入
const dotenv = require('dotenv');

dotenv.config()

//导出
module.exports = process.env
```
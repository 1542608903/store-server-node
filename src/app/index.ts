import Koa from 'koa';
import koaBody from 'koa-body';
const errHandler = require('./errHandler')
const app = new Koa();
const userRouter = require('../router/userRoute');

app.use(koaBody());
app.use(userRouter.routes());
app.on('error',errHandler)

module.exports = app
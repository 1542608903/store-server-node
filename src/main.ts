const Koa = require('koa');
const app = new Koa()
const userRouter = require('./router/userRoute')
const { APP_PORT} = require('./config/config.default')

app.use(userRouter.routes());

app.listen(APP_PORT, () => {
    return console.log(`http://127.0.0.1:${APP_PORT}/`);
}); 
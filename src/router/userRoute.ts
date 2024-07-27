//引入路由
const Router = require('koa-router');
//实例化
const router =new Router();

router.get('/user',(ctx:any,next:any)=>{
    ctx.body = 'hello Koa';
})

module.exports = router
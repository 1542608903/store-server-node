//导入控制器 
const { register, login } = require('../controller/userContrller')
//导入中间件
const { userValidator:useValidator,verifyUser:useVerifyUser } = require('../middleware/userMiddleware')
//引入路由
const Router = require('koa-router');
//实例化路由
const router = new Router({ prefix: '/user' });

//编写路由接口
router.post('/register', useValidator, useVerifyUser, register)
router.get('/login', login)

//导出路由
module.exports = router
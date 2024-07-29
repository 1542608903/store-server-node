//引入路由
const Router = require('koa-router');
//导入控制器 
const { register, login, changePassword } = require('../controller/userContrller')
//导入中间件
const {
    userValidator,
    verifyUser,
    BcryptPassword,
    verifLogin,
} = require('../middleware/userMiddleware')
const { auth } = require('../middleware/authMiddleware')
//实例化路由
const router = new Router({ prefix: '/user' });

/**
 * 编写用户路由
 */
//注册接口
router.post('/register', userValidator, verifyUser, BcryptPassword, register);

//登录接口
router.post('/login', verifLogin, login);

//修改密码接口
router.patch('/', auth, BcryptPassword, changePassword)

//导出路由
module.exports = router
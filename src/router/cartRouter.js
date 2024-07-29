const Router = require('koa-router');
const { verildatot } = require('../middleware/cartMiddleware')
const { auth } = require('../middleware/authMiddleware')

const {add} = require('../controller/cartController')

const router = new Router({ prefix: '/carts' });

router.post('/', auth, verildatot,add)

module.exports = router
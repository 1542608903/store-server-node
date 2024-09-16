const Router = require('koa-router');
// 引入中间件
const { verildatot } = require("../middleware/genericMiddleware");
const { auth } = require('../middleware/authMiddleware'); // 认证用户
const { checkGoodsExists } = require('../middleware/goodsMiddleware'); // 检查商品是否存在
// 引入控制器方法
const { add, findAll, update, remove, selectALll, unSelectAll } = require('../controller/cartController');

const {cartFormatError } = require('../constant/errType');

// 实例化路由，并设置前缀为 '/carts'
const router = new Router({ prefix: '/carts' });

// 路由：添加商品到购物车
router.post('/', auth, verildatot({ goods_id: 'number' },cartFormatError), checkGoodsExists, add);

// 路由：获取用户的购物车列表
router.get('/', auth, findAll);

// 路由：更新购物车中的商品
router.patch('/:id', auth, verildatot({
    number: { type: 'number', required: false },
    selected: { type: 'bool', required: false },
},cartFormatError), update);

// 路由：删除购物车中的商品
router.delete('/', auth, verildatot({ ids: 'array' }), remove);

// 路由：购物车全选
router.post('/selectAll', auth, selectALll);

// 路由：取消全选购物车中的商品
router.post('/unSelectAll', auth, unSelectAll);

// 导出路由模块
module.exports = router;

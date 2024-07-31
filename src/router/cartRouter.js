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
// POST /carts/
// 中间件顺序：
// 1. `auth`：认证用户，确保请求者已登录
// 2. `verildatot({ goods_id: 'number' })`：验证请求体中是否包含合法的 goods_id
// 3. `checkGoodsExists`：检查指定的商品是否存在
// 4. `add`：调用控制器方法将商品添加到购物车
router.post('/', auth, verildatot({ goods_id: 'number' },cartFormatError), checkGoodsExists, add);

// 路由：获取用户的购物车列表
// GET /carts/
// 中间件顺序：
// 1. `auth`：认证用户，确保请求者已登录
// 2. `findAll`：调用控制器方法获取购物车列表
router.get('/', auth, findAll);

// 路由：更新购物车中的商品
// PATCH /carts/:id
// 中间件顺序：
// 1. `auth`：认证用户，确保请求者已登录
// 2. `verildatot`：验证请求体中是否包含合法的 number 和 selected 属性（可选）
// 3. `update`：调用控制器方法更新购物车中的商品
router.patch('/:id', auth, verildatot({
    number: { type: 'number', required: false },
    selected: { type: 'bool', required: false },
},cartFormatError), update);

// 路由：删除购物车中的商品
// DELETE /carts/
// 中间件顺序：
// 1. `auth`：认证用户，确保请求者已登录
// 2. `verildatot({ ids: 'array' })`：验证请求体中是否包含合法的 ids 数组
// 3. `remove`：调用控制器方法删除购物车中的商品
router.delete('/', auth, verildatot({ ids: 'array' }), remove);

// 路由：购物车全选
// POST /carts/selectAll
// 中间件顺序：
// 1. `auth`：认证用户，确保请求者已登录
// 2. `selectALll`：调用控制器方法将购物车中的所有商品标记为选中
router.post('/selectAll', auth, selectALll);

// 路由：取消全选购物车中的商品
// POST /carts/unSelectAll
// 中间件顺序：
// 1. `auth`：认证用户，确保请求者已登录
// 2. `unSelectAll`：调用控制器方法将购物车中的所有商品标记为未选中
router.post('/unSelectAll', auth, unSelectAll);

// 导出路由模块
module.exports = router;

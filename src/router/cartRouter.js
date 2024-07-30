const Router = require('koa-router');
const { verildatot } = require('../middleware/cartMiddleware')
const { auth } = require('../middleware/authMiddleware')
const { checkGoodsExists } = require('../middleware/goodsMiddleware')
const { add, findAll, update,remove,selectALll,unSelectAll } = require('../controller/cartController');


const router = new Router({ prefix: '/carts' });
//添加购物车
router.post('/', auth, verildatot({ goods_id: 'number' }), checkGoodsExists, add);
//获取购物车列表
router.get('/', auth, findAll);
//更新购物车
router.patch('/:id', auth, verildatot({
    number: { type: 'number', required: false },
    selected: { type: 'bool', required: false },
}), update);
//删除购物车
router.delete('/', auth, verildatot({ ids: 'array' }),remove)

//购物车全选
router.post('/selectAll',auth,selectALll);
router.post('/unSelectAll',auth,unSelectAll);
module.exports = router
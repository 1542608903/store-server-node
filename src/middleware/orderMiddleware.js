const { findAllGoodsById } = require("../service/goodsService");
const { invalidGoodsID } = require("../constant/errType");

const verifyOrderInGoods = async (ctx, next) => {
  try {
    const orderGoods = ctx.request.body.goods_info;

    const goodsArrar = orderGoods.map((item) => item.id);

    const res = await findAllGoodsById(goodsArrar);

    if (orderGoods.length !== res.length) {
      return ctx.app.emit("error", invalidGoodsID, ctx);
    }
    await next();
  } catch (err) {
    console.error("Error in verifyOrderInGoods middleware:", err);
    ctx.app.emit("error", invalidGoodsID, ctx);
  }
};

const verifyStock = async (ctx,next)=>{

}
module.exports = { verifyOrderInGoods,verifyStock };

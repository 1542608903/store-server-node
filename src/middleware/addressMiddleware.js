const { defaultAddress } = require("../service/addressService");
const { addressNotExited } = require("../constant/errType");
const verifyDefaultAddress = async (ctx, next) => {
  const user_id = ctx.state.user.id; // 获取用户 ID
  const res = await defaultAddress(user_id);
  if (res == null) {
    ctx.app.emit("error", addressNotExited, ctx);
    return;
  }
  ctx.state.address = res.dataValues;
  await next();
};

module.exports = {
  verifyDefaultAddress,
};

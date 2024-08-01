const { addressFormatError } = require("./errType");

module.exports = {
  userFormateRules: {
    user_name: { type: "string", required: true },
    password: { type: "string", required: true },
  },
  goodsFormatRules: {
    goods_name: { type: "string", required: true },
    goods_price: { type: "number", required: true },
    goods_num: { type: "number", required: true },
    goods_img: { type: "string", required: true },
  },
  addressFormatRoles: {
    id: { type: "number", required: false },
    consignee: { type: "string" },
    phone: { type: "string", format: /^1[3-9]\d{9}$|^0\d{2,3}-\d{7,8}$/ },
    address: { type: "string" },
  },
  goodsInfoRules: {
    goods_info: {
      type: "array",
      itemType: "object",
      rule: {
        id: { type: "integer", required: true },
        goods_price: {
          type: "string",
          required: true,
          pattern: /^\d+(\.\d{1,2})?$/,
        }, // 价格格式验证
        quantity: { type: "integer", min: 1, required: true },
      },
      required: true,
    },
  },
};

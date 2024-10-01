//邮箱域名只能是163.com，qq.com或者42du.cn。
const emilRules =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRules = /^1[3-9]\d{9}$|^0\d{2,3}-\d{7,8}$/;

module.exports = {
  registerRules: {
    nik_name: { type: "string", required: false },
    email: {
      type: "string",
      required: true,
      format: emilRules,
    },
    user_name: { type: "string", required: true },
    password: { type: "string", required: true },
  },
  loginRules: {
    user_name: { type: "string", required: true },
    password: { type: "string", required: true },
  },
  updateUserRules: {
    nick_name: { type: "string", required: true },
    email: {
      type: "string",
      required: true,
      format: emilRules,
    },
    password: { type: "string", required: true },
  },
  goodsFormatRules: {
    goods_name: { type: "string", required: true },
    goods_price: { type: "number", required: true },
    goods_num: { type: "number", required: true },
    goods_img: { type: "string", required: true },
  },
  addressFormatRules: {
    id: { type: "number", required: false },
    consignee: { type: "string" },
    phone: { type: "string", format: phoneRules },
    address: { type: "string" },
    user_id: { type: "number", required: false },
  },
  // 订单
  orderInfoRules: {
    data: {
      type: "array",
      itemType: "object",
      rule: {
        id: {
          type: "integer",
          required: true,
        },
        goods_price: {
          type: "string",
          required: true,
          pattern: /^\d+(\.\d{1,2})?$/, // 价格格式验证：数字，最多两位小数
        },
        quantity: {
          type: "number",
          min: 1, // 数量必须大于等于1
          required: true,
        },
      },
      required: true,
    },
    id: {
      type: "integer",
      required: true,
    },
    total: {
      type: "number",
      required: true,
      min: 0, // 确保总金额为非负数
    },
  },
};

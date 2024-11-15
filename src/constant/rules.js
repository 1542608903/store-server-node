//邮箱域名只能是163.com，qq.com或者42du.cn。
const emilRules =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// 新的邮箱规则
const newEmailRules = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
module.exports = {
  // registerRules: {
  //   nik_name: { type: "string", required: false },
  //   user_name: { type: "string", min: 4, max: 16, required: true },
  //   email: { type: "string", required: true, format: newEmailRules },
  //   password: { type: "string", min: 6, max: 16, required: true },
  //   codeKey: { type: "string", required: true },
  //   code: { type: "string", required: true },
  // },
  registerRules: {
    nik_name: {
      type: "string",
      required: false, // 昵称不是必填项
      max: 20, // 如果有限制，建议加上最大字符限制
    },
    user_name: {
      type: "string",
      min: 4,
      max: 16,
      required: true,
      description: "用户名必须是字符串，长度在 4 到 16 字符之间",
    },
    email: {
      type: "string",
      required: true,
      format: newEmailRules,
    },
    password: {
      type: "string",
      min: 6,
      max: 16,
      required: true,
      description: "密码必须是字符串，长度在 6 到 16 字符之间",
    },
    codeKey: {
      type: "string",
      required: true,
    },
    code: {
      type: "string",
      required: true,
    },
  },
  loginRules: {
    user_name: {
      type: "string",
      required: true,
      min: 4,
      max: 16,
      description: "用户名必须是字符串，长度在 4 到 16 字符之间",
    },
    password: {
      type: "string",
      min: 6,
      max: 16,
      required: true,
      description: "密码必须是字符串，长度在 6 到 16 字符之间",
    },
    codeKey: {
      type: "string",
      required: true,
    },
    code: {
      type: "string",
      required: true,
    },
  },

  updateUserRules: {
    nick_name: { type: "string", required: false },
    email: { type: "string", required: false, format: newEmailRules },
    password: { type: "string", required: false },
    avatar: { type: "string", required: false },
  },
  // 商品
  goodsFormatRules: {
    id: { type: "integer", required: false },
    goods_name: {
      type: "string",
      required: true,
      description: "商品名称，必须是字符串且必填",
    },
    goods_price: {
      type: "number",
      required: true,
      min: 0,
      description: "商品价格，必须为正数且必填",
    },
    goods_num: {
      type: "number",
      required: true,
      min: 1,
      description: "商品数量，必须大于等于 1",
    },
    goods_img: {
      type: "string",
      required: true,
      format: /^http?:\/\/.+(\.jpg|\.jpeg|\.png|\.gif)$/,
      description:
        "商品图片链接，必须是有效的 URL 地址，并且是图片格式（jpg, jpeg, png, gif）",
    },
  },
  // 用户地址
  addressFormatRules: {
    id: { type: "integer", required: false },
    consignee: {
      type: "string",
      required: true, // 确保收件人是必填项
      minLength: 1, // 确保至少有一个字符
    },
    phone: {
      type: "string",
      format: /^(1[3-9]\d{9}$)|(0\d{2,3}-\d{7,8}$)/,
      required: true, // 手机号也是必填项
    },
    address: {
      type: "string",
      required: true, // 地址也是必填项
      minLength: 2, // 地址至少要有一个字符
    },
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
          description: "商品 ID，必须是整数且必填",
        },
        goods_price: {
          type: "string",
          required: true,
          pattern: /^\d+(\.\d{1,2})?$/, // 金额格式，支持小数点后最多两位
          description: "商品价格，必须是一个合法的价格格式，如 100 或 99.99",
        },
        quantity: {
          type: "number",
          required: true,
          min: 1, // 数量最小值为 1
          description: "商品数量，必须大于等于 1",
        },
        addressId: {
          type: "integer",
          required: true,
          description: "地址 ID，必须是整数且必填",
        },
        total: {
          type: "number",
          required: true,
          min: 0, // 最小值为 0，避免负数
          description: "订单总价，必须为正数或 0",
        },
      },
      required: true,
      description: "订单数据必须是包含商品信息的数组",
    },
  },
  // 购物车
  cartFormatRules: {
    goods_id: {
      type: "integer",
      required: true,
      description: "商品 ID，必须是整数且必填",
    },
  },
  cartSelectRules: {
    id: {
      type: "integer",
      required: true,
      description: "商品 ID，必须是整数且必填",
    },
    selected: { type: "boolean", required: true },
  },
  cartNumberRules: {
    id: {
      type: "integer",
      required: true,
      description: "商品 ID，必须是整数且必填",
    },
    number: {
      type: "integer",
      required: true,
      description: "商品数量，必须是整数且必填",
    },
  },
  // 购物车删除 数据类型[1,2,3]
  cartDeleteRules: {
    ids: { type: "array", itemType: "integer", required: true },
  },
};

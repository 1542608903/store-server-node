const { FILE_TYPE } = require("../config/config.default");
module.exports = {
  serverError: {
    code: "99999",
    message: "服务器错误",
    result: "",
  },
  userRegisterError: {
    code: "10000",
    message: "用户注册错误",
    result: "",
  },
  userFormateError: {
    code: "10001",
    message: "用户格式错误",
    result: "",
  },
  userAlreadyExited: {
    code: "10002",
    message: "用户已存在",
    result: "",
  },
  emailExited: {
    code: "10003",
    message: "邮箱存在",
    result: "",
  },
  userRegisterError: {
    code: "10003",
    message: "用户注册失败",
    result: "",
  },
  notUserExited: {
    code: "10004",
    message: "用户不存在",
    result: "",
  },
  userLoginError: {
    code: "10005",
    message: "用户登录失败",
    result: "",
  },
  passwordError: {
    code: "10006",
    message: "密码错误",
    result: "",
  },
  invalidPasswordError: {
    code: "10006",
    message: "密码错误",
    result: "",
  },
  adminError: {
    code: "10006",
    message: "管理认证错误",
    result: "",
  },

  passwordNotError: {
    code: "10007",
    message: "密码不能为空",
    result: "",
  },
  updateUserError: {
    code: "10008",
    message: "修改信息失败",
    result: "",
  },
  TokenExpiredError: {
    code: "10101",
    message: "身份已过期",
    result: "",
  },
  // token
  JsonWebTokenError: {
    code: "10102",
    message: "身份不存在",
    result: "",
  },
  NullTokenError: {
    code: "10103",
    message: "未携带token",
    result: "",
  },
  refreshTokenError: {
    code: "10106",
    message: "刷新token过期",
    result: "",
  },
  hasNotAdminPermission: {
    code: "10104",
    message: "没有管理员权限",
    result: "",
  },
  ontAdmin: {
    code: "10105",
    message: "你不是管理员",
    result: "",
  },

  fileUploadError: {
    code: "10201",
    message: "文件上传失败",
    result: "",
  },
  unsupportedFileType: {
    code: "10202",
    message: `仅支持：${FILE_TYPE}`,
    result: {},
  },
  goodsFormatError: {
    code: "10203",
    message: "商品参数格式错误",
    result: "",
  },
  publishGoodsError: {
    code: "10204",
    message: "商品发布错误",
    result: "",
  },
  invalidGoodsID: {
    code: "10205",
    message: "商品不存在",
    result: "",
  },
  addCartError: {
    code: "10301",
    message: "添加购物车失败",
    result: "",
  },
  getCartError: {
    code: "10303",
    message: "获取购物车失败",
    result: "",
  },
  cartFormatError: {
    code: "10304",
    message: "购物车数据格式错误",
    result: "",
  },
  addressFormatError: {
    code: "10400",
    message: "地址数据格式错误",
    result: "",
  },
  addressUpdateError: {
    code: "10401",
    message: "更新地址错误",
    result: "",
  },
  addressNotExited: {
    code: "10403",
    message: "地址不存在",
    result: "",
  },
  creatOrderError: {
    code: "10500",
    message: "创建订单失败",
    result: "",
  },
  verifyOntOrder: {
    code: "10051",
    message: "没有订单",
    result: "",
  },
  deleteOrderError: {
    code: "10502",
    message: "删除订单失败",
    result: "",
  },
  updateOrderError: {
    code: "10503",
    message: "修改订单失败",
    result: "",
  },
};

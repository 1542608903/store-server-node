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
    message: "用户参数错误",
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
  passwordError: {
    code: "10009",
    message: "密码错误",
    result: "",
  },
  updatePasswordError: {
    code: "10010",
    message: "修改密码失败",
    result: "",
  },
  oldPasswordError: {
    code: "10011",
    message: "原密码错误",
    result: "",
  },
  TokenExpiredError: {
    code: "10101",
    message: "登录已过期",
    result: "",
  },
  // token
  JsonWebTokenError: {
    code: "10102",
    message: "令牌错误",
    result: "",
  },
  NullTokenError: {
    code: "10103",
    message: "未携带令牌",
    result: "",
  },
  refreshTokenError: {
    code: "10106",
    message: "令牌过期",
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
  captchaError: {
    code: "10106",
    message: "验证码错误",
    result: "",
  },
  captchaLose: {
    code: "10107",
    message: "验证码过期",
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
  minioServrError: {
    code: "10203",
    message: "minio文件服务器出错",
    result: "",
  },
  onlineServrError: {
    code: "10204",
    message: "online文件服务器出错",
    result: "",
  },
  localServrError: {
    code: "10205",
    message: "local文件服务器出错",
    result: "",
  },
  goodsFormatError: {
    code: "10203",
    message: "商品有误",
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
  goodsUpdateError: {
    code: "10206",
    message: "商品更新错误",
    result: "",
  },
  goodsRemoveError: {
    code: "10207",
    message: "商品下架错误",
    result: "",
  },
  goodsRestoreError: {
    code: "10208",
    message: "商品上架错误",
    result: "",
  },

  addCartError: {
    code: "10301",
    message: "添加购物车出错",
    result: "",
  },
  getCartError: {
    code: "10303",
    message: "您没有购物车",
    result: "",
  },
  cartFormatError: {
    code: "10304",
    message: "购物车有误",
    result: "",
  },
  addressFormatError: {
    code: "10400",
    message: "地址有误",
    result: "",
  },
  addressUpdateError: {
    code: "10401",
    message: "修改地址出错",
    result: "",
  },
  addressNotExited: {
    code: "10403",
    message: "地址不存在",
    result: "",
  },
  defaultAddressNotDel: {
    code: "10404",
    message: "默认地址不能删除",
    result: "",
  },
  onDefaultAddress: {
    code: "10405",
    message: "您没有设置默认地址",
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
    message: "更新订单状态失败",
    result: "",
  },
  orderTotalPriceError: {
    code: "10504",
    message: "订单价格错误",
  },
  orderFormError: {
    code: "10505",
    message: "订单有误",
  },
  // 限流错误类型
  limitError: {
    code: "10601",
    message: "由于您频繁访问,已被封禁300秒",
    result: "",
  },
};

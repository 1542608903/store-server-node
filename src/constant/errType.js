const { unsupportedEngine } = require("sequelize/lib/utils/deprecations");

module.exports = {
    userFormateError: {
        code: '10001',
        message: '用户名或者密码为空',
        result: ''
    },
    userAlreadyExited: {
        code: '10002',
        message: '用户已存在',
        result: ''
    },
    userRegisterError: {
        code: '10003',
        message: '用户注册错误',
        result: ''
    },
    notUserExited: {
        code: '10004',
        message: '用户不存在',
        result: ''
    },
    userLoginError: {
        code: '10005',
        message: '用户登录失败',
        result: ''
    },
    invalidPasswordError: {
        code: '10006',
        message: '密码无效',
        result: ''
    },
    TokenExpiredError: {
        code: '10101',
        message: 'token已过期',
        result: ''
    },
    JsonWebTokenError: {
        code: '10102',
        message: 'token错误',
        result: ''
    },
    NullTokenError: {
        code: '10103',
        message: '未携带 token',
        result: ''
    },
    hasNotAdminPermission: {
        code: '10104',
        message: '没有管理员权限',
        result: ''
    },
    fileUploadError: {
        code: '10201',
        message: '图片上传失败',
        result: ''
    },
    unsupportedFileType: {
        code: '10202',
        message: '图片仅支持jpeg和png',
        result: {}
    },
    goodsFormatError: {
        code: '10203',
        message: '商品参数格式错误',
        result: ''
    },
    publishGoodsError: {
        code: '10204',
        message: '商品发布错误',
        result: ''
    },
    invalidGoodsID: {
        code: '10205',
        message: '商品ID不存在',
        result: ''
    },
    addCartError: {
        code: '10301',
        message: '添加购物车失败',
        result: ''
    },
    getCartError: {
        code: '10303',
        message: '获取购物车失败',
        result: ''
    },
    cartFormatError: {
        code: '10304',
        message: '购物车数据格式错误',
        result: ''
    }
}
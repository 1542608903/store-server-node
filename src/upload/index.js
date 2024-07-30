const path = require('path');
const fs = require('fs')
const { fileUploadError } = require('../constant/errType');

/**
 * 处理图片上传
 * @param {Object} ctx - Koa 上下文对象
 * @param {Function} next - Koa 的下一个中间件函数
 * @returns {Promise<void>}
 */
const upload = async (ctx) => {
    try {
        const { file } = ctx.request.files;
        console.log(file);
        if (file) {
            ctx.body = {
                code: 0,
                message: '商品图片上传成功',
                result: {
                    goods_img: path.basename(file.filepath),
                }
            };
        } else {
            ctx.app.emit('error', fileUploadError, ctx);
        }
    } catch (err) {
        console.error('文件上传失败', err);
        fs.unlink(file.filepath, (err) => console.error('删除文件失败'))
        ctx.app.emit('error', fileUploadError, ctx);
    }
}

module.exports = { upload }
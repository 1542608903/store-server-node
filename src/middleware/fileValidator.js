const fs = require('fs');
const path = require('path');
const { unsupportedFileType } = require('../constant/errType');

/**
 * 文件格式验证中间件
 * @param {Array<string>} allowedTypes - 允许的文件类型
 */
const fileValidator = (allowedTypes) => {
    return async (ctx, next) => {
        try {
            const { file } = ctx.request.files;
            if (file) {
                const fileType = file.mimetype;

                // 验证文件类型
                if (!allowedTypes.includes(fileType)) {
                    // 删除无效的文件
                    fs.unlink(file.filepath, (err) => {
                        if (err) {
                            console.error('删除无效文件失败', err);
                        }
                    });
                    return ctx.app.emit('error', unsupportedFileType, ctx);
                }
            }
            await next();
        } catch (err) {
            console.error('文件格式验证失败', err);
            // 确保在处理异常时也删除文件
            const { file } = ctx.request.files;
            if (file) {
                fs.unlink(file.filepath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('删除文件失败', unlinkErr);
                    }
                });
            }
            ctx.app.emit('error', unsupportedFileType, ctx);
        }
    };
};

module.exports = fileValidator;

const fs = require('fs');
const { unsupportedFileType } = require('../constant/errType');

/**
 * 文件格式验证中间件
 * @param {Array<string>} allowedTypes - 允许的文件类型
 */
const fileValidator = (allowedTypes) => {
    return async (ctx, next) => {
        try {
            const { files } = ctx.request; // 获取上传的文件

            if (!files.file) {
                unsupportedFileType.result = '未找到上传的文件';
                return ctx.app.emit('error', unsupportedFileType, ctx);
            }

            const file = files.file;

            if (Array.isArray(file)) {
                unsupportedFileType.result = '只支持单文件上传';
                // 删除所有上传的文件
                file.forEach(f => {
                    fs.unlink(f.filepath, (err) => {
                        if (err) { console.error('删除文件失败', err); }
                    });
                });
                return ctx.app.emit('error', unsupportedFileType, ctx);
            }
            // 获取文件的后缀名
            const fileType = file.mimetype.split('/')[1];

            // 验证文件类型
            if (!allowedTypes.includes(fileType)) {
                // 删除无效的文件
                fs.unlink(file.filepath, (err) => {
                    if (err) { console.error('删除文件失败', err); }
                });

                unsupportedFileType.result = `您的上传格式为: .${fileType}`;
                return ctx.app.emit('error', unsupportedFileType, ctx);
            }

            // 返回有效文件的路径
            ctx.body = { filePath: file.filepath };

            await next();
        } catch (err) {
            console.error('文件格式验证失败', err);
            // 确保在处理异常时也删除文件
            const { files } = ctx.request;
            if (files && files.file) {
                const file = files.file;
                const fileArray = Array.isArray(file) ? file : [file];
                fileArray.forEach(f => {
                    fs.unlink(f.filepath, (err) => {
                        if (err) { console.error('删除文件失败', err); }
                    });
                });
            }
            ctx.app.emit('error', unsupportedFileType, ctx);
        }
    };
};

module.exports ={fileValidator};

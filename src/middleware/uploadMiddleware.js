const { unsupportedFileType } = require("../constant/errType");
const { FILE_TYPE } = require("../config/config.default");
const { deleteOnlineImgs } = require("../utils/upload");

const fileTypeValidator = async (ctx, next) => {
  try {
    const { file } = ctx.request.files; // 获取上传的文件
    const types = [];

    if (Array.isArray(file)) {
      types.push(...file.map((item) => item.mimetype));
    } else {
      types.push(file.mimetype);
    }

    if (FILE_TYPE.includes(...types)) {
      await next();
    } else {
      await deleteOnlineImgs(file);
      ctx.app.emit("error", unsupportedFileType, ctx);
    }
  } catch (error) {
    await deleteOnlineImgs(file);
    console.log(error);
    
    throw error;
  }
};

module.exports = { fileTypeValidator };

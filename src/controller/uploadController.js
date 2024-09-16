const path = require("path");
const fs = require("fs");
const { fileUploadError } = require("../constant/errType");
const { minioUpload, deleteMinioImgs } = require("../utils/upload/minioUpload");
const {
  UPLOAD_TYPE,
  BASEURL,
  STORAGE_HOST,
} = require("../config/config.default");
class uploadController {
  /**
   * 处理图片上传
   * @returns {Promise<void>}
   */
  async upload(ctx) {
    const { file } = ctx.request.files;
    if (!file) return;
    try {
      switch (UPLOAD_TYPE) {
        case "local":
          ctx.body = {
            code: 0,
            message: "上传成功",
            result: {
              url: `${BASEURL}local/${path.basename(file.filepath)}`,
            },
          };
          break;
        case "online":
          ctx.body = {
            code: 0,
            message: "上传成功",
            result: {
              url: `${BASEURL}online/${path.basename(file.filepath)}`,
            },
          };
          break;
        case "minio":
          const res = await minioUpload(file.filepath);

          if (!res) return ctx.app.emit("error", fileUploadError, ctx);

          ctx.body = {
            code: 0,
            message: "上传成功",
            result: {
              url: `http://${STORAGE_HOST}${res}`,
            },
          };
          break;
      }
      // 删除配置
    } catch (err) {
      return ctx.app.emit("error", fileUploadError, ctx);
    }
  }

  // 删除服务器下的照片
  async deleteOnlineImgs(imgList) {
    Array.isArray(imgList) &&
      imgList.length &&
      imgList.forEach((v) => {
        if (v) {
          let filePath = path
            .join(__dirname, "./upload/online/" + v)
            .replace("/controller/utils", "");
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
  }
}
module.exports = new uploadController();

const path = require("path");
const fs = require("fs");
const { fileUploadError } = require("../constant/errType");
const { minioUpload, deleteMinioImgs } = require("../utils/upload/minioUpload");
const {
  UPLOAD_TYPE,
  BASEURL,
  STORAGE_HOST,
  HTTP,
} = require("../config/config.default");
class uploadController {
  /**
   * 处理图片上传
   * @returns {Promise<void>}
   */
  async upload(ctx) {
    try {
      const { file } = ctx.request.files;
      let URL_BASEURL = "";
      let STORAGE_HOST_URL = "";

      //判断URL地址是否/结束
      if (!BASEURL.endsWith("/")) {
        URL_BASEURL = BASEURL + "/";
      }
      if (!STORAGE_HOST.endsWith("/")) {
        STORAGE_HOST_URL = STORAGE_HOST + "/";
      }

      switch (UPLOAD_TYPE) {
        case "local":
          ctx.body = {
            code: 0,
            message: "上传成功",
            result: {
              url: `${URL_BASEURL}local/${path.basename(file.filepath)}`,
            },
          };
          break;
        case "online":
          ctx.body = {
            code: 0,
            message: "上传成功",
            result: {
              url: `${URL_BASEURL}online/${path.basename(file.filepath)}`,
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
              url: `${HTTP}://${STORAGE_HOST_URL}${res}`,
            },
          };
          break;
      }
      // 删除配置
    } catch (err) {
      console.log(err);

      return ctx.app.emit("error", fileUploadError, ctx);
    }
  }

  // 删除服务器下的照片
  async deleteOnlineImgs(imgList) {
    if (Array.isArray(imgList) && imgList.length) {
      imgList.forEach((v) => {
        if (v) {
          // 假设文件存在 ./upload/online/ 目录下
          const filePath = path.resolve(__dirname, `../upload/online/${v}`);

          // 检查文件是否存在
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    }
  }
}

module.exports = new uploadController();

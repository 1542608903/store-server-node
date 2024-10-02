const {
  fileUploadError,
  localServrError,
  onlineServrError,
  minioServrError,
} = require("../constant/errType");
const { minioUpload } = require("../utils/upload/minioUpload");
const { deleteOnlineImgs, queryFileName } = require("../utils/upload");
const {
  UPLOAD_TYPE,
  BASEURL,
  STORAGE_HOST,
} = require("../config/config.default");
class uploadController {

  /**
   * 处理图片上传
   */
  async upload(ctx) {
    const { file } = ctx.request.files;
    try {
      let URL_BASEURL = BASEURL;

      //判断URL地址是否/结束
      if (!BASEURL.endsWith("/")) {
        URL_BASEURL = BASEURL + "/";
      }

      const res = await queryFileName(file);
      
      const fileList = res.map(
        (item) => `${URL_BASEURL}${UPLOAD_TYPE}/${item}`
      );
      switch (UPLOAD_TYPE) {
        case "local":
          ctx.body = {
            code: 0,
            message: "上传成功",
            result: {
              url: fileList.length === 1 ? fileList[0] : fileList,
            },
          };
          break;
        case "online":
          ctx.body = {
            code: 0,
            message: "上传成功",
            result: {
              url: fileList.length === 1 ? fileList[0] : fileList,
            },
          };
          break;
        case "minio":
          const minioList = [];
          if (Array.isArray(file)) {
            for (let item of file) {
              const res = await minioUpload(item.filepath);
              const fileItem = `http://${STORAGE_HOST}:9000${res}`;
              minioList.push(fileItem);
            }
          } else {
            const res = await minioUpload(file.filepath);
            const data = `http://${STORAGE_HOST}:9000${res}`;
            minioList.push(data);
          }
          ctx.body = {
            code: 0,
            message: "上传成功",
            result: {
              url: minioList.length === 1 ? minioList[0] : minioList,
            },
          };
          break;
      }
    } catch (err) {
      switch (UPLOAD_TYPE) {
        case "local":
          ctx.app.emit("error", localServrError, ctx);
          break;
        case "online":
          ctx.app.emit("error", onlineServrError, ctx);
          break;
        case "minio":
          ctx.app.emit("error", minioServrError, ctx);
          break;
        default:
          ctx.app.emit("error", fileUploadError, ctx);
          break;
      }
      await deleteOnlineImgs(file);
      throw err;
    }
  }
}

module.exports = new uploadController();

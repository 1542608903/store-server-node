const {
  fileUploadError,
  localServrError,
  onlineServrError,
  minioServrError,
} = require("../constant/errType");
const { minioUpload } = require("../utils/upload/minioUpload");
const {
  deleteOnlineImgs,
  queryFileName,
  renameFile,
} = require("../utils/upload");
const {
  UPLOAD_TYPE,
  BASEURL,
  STORAGE_HOST,
} = require("../config/config.default");
const UUID = require("../utils/uuid");
const sendResponse = require("../utils/response");
const path = require("path");

class uploadController {
  /**
   * 图片上传
   */
  async upload(ctx) {
    const { file } = ctx.request.files;
    try {
      let URL_BASEURL = BASEURL;

      const fileNames = [];

      //判断URL地址是否/结束
      if (!BASEURL.endsWith("/")) {
        URL_BASEURL = BASEURL + "/";
      }
      // 文件重命名
      if (Array.isArray(file)) {
        for (let item of file) {
          const newFileName = `${UUID()}${path.extname(item.originalFilename)}`;
          item.filepath = await renameFile(item.filepath, newFileName);
        }
      } else {
        const newFileName = `${UUID()}${path.extname(file.originalFilename)}`;
        file.filepath = await renameFile(file.filepath, newFileName);
      }

      const mames = queryFileName(file);

      fileNames.push(
        ...mames.map((item) => `${URL_BASEURL}${UPLOAD_TYPE}/${item}`)
      );

      switch (UPLOAD_TYPE) {
        case "local":
        case "online":
          sendResponse(ctx, 0, "上传成功", fileNames);
          break;
        case "minio":
          const minioList = []; // 初始化minioList
          if (Array.isArray(file)) {
            const uploadPromises = file.map(async (item) => {
              const minioRes = await minioUpload(item.filepath);
              const fileItem = `http://${STORAGE_HOST}:9000${minioRes}`;
              return fileItem;
            });
            const minioUrls = await Promise.all(uploadPromises);

            minioList.push(...minioUrls);
          } else {
            const minioRes = await minioUpload(file.filepath);
            const minioUrl = `http://${STORAGE_HOST}:9000${minioRes}`;
            minioList.push(minioUrl);
          }
          sendResponse(ctx, 0, "上传成功", minioList);
          break;
        default:
          fileUploadError.message = "上传类型不支持";
          ctx.app.emit("error", fileUploadError, ctx);
          break;
      }
    } catch (error) {
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
          fileUploadError.message = "上传类型不支持";
          ctx.app.emit("error", fileUploadError, ctx);
          break;
      }

      await deleteOnlineImgs(file);
      console.log(error);
      throw error;
    }
  }
}

module.exports = new uploadController();

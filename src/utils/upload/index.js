const fs = require("fs");
const path = require("path"); // 导入 path 模块
const { UPLOAD_TYPE } = require("../../config/config.default");
/**
 * 删除本地临时上传文件

 * @param {File} file - 上传的文件对象
 * @returns {Promise} - 返回一个 Promise
 */
const deleteOnlineImgs = (file) => {
  const fileNmae = [];

  if (Array.isArray(file)) {
    fileNmae.push(...file.map((itme) => path.basename(itme.filepath)));
  } else {
    fileNmae.push(path.basename(file.filepath));
  }
  return new Promise((resolve, reject) => {
    try {
      if (!Array.isArray(fileNmae)) {
        return reject(new Error("文件不是数组"));
      }

      fileNmae.forEach((item) => {
        const filePath = path.resolve(
          __dirname,
          `../../public/${UPLOAD_TYPE}/${item}`
        );

        // 使用 fs.unlink 进行异步删除
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`删除文件 ${item} 失败: ${err.message}`);
            return reject(err);
          }
          console.log(`文件 ${filePath} 已删除`);
        });
      });

      resolve(`所有文件已删除`);
    } catch (error) {
      reject(error);
    }
  });
};
/**
 * 
 * @param {File} file 
 * @returns 
 */
const queryFileName = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const fileNmae = [];
      if (Array.isArray(file)) {
        fileNmae.push(...file.map((itme) => path.basename(itme.filepath)));
      } else {
        fileNmae.push(path.basename(file.filepath));
      }
      resolve(fileNmae);
    } catch (error) {
      return reject(error.message);
    }
  });
};

module.exports = {
  deleteOnlineImgs,
  queryFileName,
};

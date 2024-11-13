const fs = require("fs");
const path = require("path");
const { UPLOAD_TYPE } = require("../../config/config.default");
/**
 * 删除本地临时上传文件

 * @param {File} file  上传的文件对象
 * @returns {Promise}  返回一个 Promise
 */
const deleteOnlineImgs = async (file) => {
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
            return reject(err);
          }
        });
      });

      resolve(`所有文件已删除`);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 查询文件名
 * @param {File|Array} file 上传的文件对象或文件对象数组
 * @returns {Array} 返回包含文件名的数组
 */
const queryFileName = (file) => {
  const fileNames = []; // 创建一个数组来存储文件名

  // 判断传入的 `file` 是否是数组
  if (Array.isArray(file)) {
    // 如果是数组，遍历每个文件对象，确保每个文件都有有效的 filepath
    file.forEach((item) => {
      if (item.filepath) {
        fileNames.push(path.basename(item.filepath));
      } else {
        console.warn("文件对象缺少文件路径:", item);
      }
    });
  } else {
    // 如果是单个文件对象，确保文件有有效的 filepath
    if (file.filepath) {
      fileNames.push(path.basename(file.filepath));
    } else {
      console.warn("文件对象缺少文件路径:", file); // 打印警告，说明文件缺少路径
    }
  }

  return fileNames; // 返回文件名数组
};

/**
 * 文件重命名函数
 * @param {string} oldPath  原始文件路径
 * @param {string} newName  新文件名（含扩展名）
 * @returns {Promise<string>}  返回重命名后的新路径
 */
async function renameFile(oldPath, newName) {
  if (!oldPath || typeof oldPath !== "string") {
    throw new Error(`无效的路径: ${oldPath}`);
  }

  const newPath = path.join(path.dirname(oldPath), newName);

  // 使用 Promise 包装 fs.rename 操作，使其支持异步操作
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        reject(new Error(`重命名失败: ${err.message}`));
      } else {
        resolve(newPath); // 返回新路径
      }
    });
  });
}

// 导出函数
module.exports = {
  deleteOnlineImgs,
  queryFileName,
  renameFile,
};

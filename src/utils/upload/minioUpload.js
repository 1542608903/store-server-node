const Minio = require("minio");
const {
  STORAGE_HOST,
  STORAGE_BUCKET,
  STORAGE_SecretKey,
  STORAGE_AccessKey,
  UPLOAD_TYPE,
} = require("../../config/config.default"); // 从配置文件中获取密钥

let minioClient;

if (UPLOAD_TYPE == "minio") {
  if (STORAGE_HOST && STORAGE_AccessKey && STORAGE_SecretKey) {
    try {
      minioClient = new Minio.Client({
        endPoint: STORAGE_HOST,
        port: 9000,
        useSSL: false,
        accessKey: STORAGE_AccessKey,
        secretKey: STORAGE_SecretKey,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    console.error("请在env里完善minio配置项");
  }
}

// 生成随机文件名
const generateRandomFileName = (length) => {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; // ASCII编码表中包含所有英文字母及其大写形式
  var fileName = "";

  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * chars.length);
    fileName += chars[randomIndex];
  }

  return fileName;
};

function bucketExists() {
  // 判断bucket是否存在
  return new Promise((resolve, reject) => {
    minioClient.bucketExists(STORAGE_BUCKET, function (err, exists) {
      if (err) {
        if (err.code == "NoSuchBucket") {
          // 如果bucket不存在，创建新的bucket
          minioClient.makeBucket(STORAGE_BUCKET, "us-east-1", function (err) {
            if (err) {
              console.log("桶创建失败", err);
              resolve(false);
            } else {
              console.log("桶创建成功");
              resolve(true);
            }
          });
        } else {
          console.log("检查桶是否存在时出错:", err);
          resolve(false);
        }
      } else {
        resolve(true);
      }
    });
  });
}

function upload(filePath) {
  const metaData = {
    "Content-Type": "application/octet-stream",
    "X-Amz-Meta-Testing": 1234,
    example: 5678,
  };
  const fileName = generateRandomFileName(12);
  return new Promise((resolve) => {
    minioClient.fPutObject(
      STORAGE_BUCKET,
      fileName,
      filePath,
      metaData,
      function (err) {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(`/${STORAGE_BUCKET}/` + fileName);
        }
      }
    );
  });
}


/**
 * 删除 MinIO 图片
 * @param {Array<string>} imgList - 要删除的图片文件名数组
 * @returns {void}
 */
function deleteMinioImgs(imgList) {
  imgList.forEach((v) => {
    minioClient.removeObject(STORAGE_BUCKET, v);
  });
}

/**
 * 上传文件到 MinIO 存储桶
 * @param {string} filePath - 要上传的文件的本地路径
 * @returns {Promise<string|boolean>} - 返回上传后的文件 URL 或 false（如果上传失败）
 */
const minioUpload = async (filePath) => {
  try {
    const exist = await bucketExists();
    if (!exist) {
      console.log("bucket不存在");
      return;
    }
    const url = await upload(filePath);
    if (url) {
      return url;
    } else {
      return false;
    }
  } catch (err) {
    throw err
  }
};

module.exports = {
  minioUpload, // 文件上传函数
  generateRandomFileName, // 随机文件名生成函数
  deleteMinioImgs, // 删除图片函数
};

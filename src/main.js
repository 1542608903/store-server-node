const { app } = require("./app");
const { APP_PORT, UPLOAD_TYPE } = require("./config/config.default");
app.listen(APP_PORT, () => {
  console.log("上传模式:", UPLOAD_TYPE);
  console.log(`http://127.0.0.1:${APP_PORT}`);
});

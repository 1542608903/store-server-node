const node_app = require("./app");
const { APP_PORT } = require("./config/config.default");

node_app.listen(APP_PORT, () => {
  console.log(`http://127.0.0.1:${APP_PORT}/`);
});

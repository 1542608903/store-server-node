const { Sequelize } = require("sequelize");

const {
  MYSQL_DB,
  MYSQL_ROOT,
  MYSQL_PASSWORD,
  MYSQL_HOST,
  MYSQL_PORT,
} = require("../config/config.default");

const seq = new Sequelize(MYSQL_DB, MYSQL_ROOT, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  dialect: "mysql",
});

seq
  .authenticate()
  .then(() => {
    console.log("Mysql连接成功");
  })
  .catch((err) => {
    console.log("数据库连接失败：", err);
  });

module.exports = seq;

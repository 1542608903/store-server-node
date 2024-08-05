const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "1.0.0",
    info: {
      title: "商城",
      version: "1.0.0",
      description: "API Documentation",
    },
  },
  apis: ["../router/*.js"], // 确保路径正确指向你的路由文件
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

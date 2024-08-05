const Router = require("koa-router");

const router = new Router();

// 将 Swagger UI 中间件添加到路由
router.get("/swagger.json", async (ctx) => {
  ctx.set("Content-Type", "application/json");
  ctx.body = swaggerSpec;
});

module.exports = router;

const Router = require("koa-router");
const {getProvinces,getCities,getAreas,getStreets,getVillages} = require("../controller/location")
const router = new Router({ prefix: "/location" });

// 获取所有省
router.get("/provinces",getProvinces);

// 根据省获取市
router.get("/cities",getCities);

// 根据市获取区
router.get("/areas",getAreas);

// 根据区获取街道
router.get("/streets",getStreets);

// 根据街道获取村
router.get("/villages",getVillages);

module.exports = router;

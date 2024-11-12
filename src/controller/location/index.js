const {
  queryProvinces,
  queryCities,
  queryAreas,
  queryStreets,
  queryVillages,
} = require("../../service/location");
class LocationController {
  async getProvinces(ctx) {
    try {
      const provinces = await queryProvinces();
      ctx.body = {
        code: 0,
        message: "成功",
        result: provinces,
      };
    } catch (error) {
      throw error;
    }
  }
  async getCities(ctx) {
    const { provinceCode } = ctx.query;
    try {
      const cities = await queryCities(provinceCode);
      ctx.body = {
        code: 0,
        message: "成功",
        result: cities,
      };
    } catch (error) {
      throw error;
    }
  }
  async getAreas(ctx) {
    const { cityCode } = ctx.query;
    try {
      const areas = await queryAreas(cityCode);
      ctx.body = {
        code: 0,
        message: "成功",
        result: areas,
      };
    } catch (error) {
      throw error;
    }
  }
  async getStreets(ctx) {
    const { areaCode } = ctx.query;
    try {
      const streets = await queryStreets(areaCode);
      ctx.body = {
        code: 0,
        message: "成功",
        result: streets,
      };
    } catch (error) {
      throw error;
    }
  }
  async getVillages(ctx) {
    const { streetCode } = ctx.query;
    try {
      const villages = await queryVillages(streetCode);
      ctx.body = {
        code: 0,
        message: "成功",
        result: villages,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new LocationController();

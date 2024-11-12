const Province = require("../../model/area/Province");
const Areas = require("../../model/area/Area");
const City = require("../../model/area/City");
const Street = require("../../model/area/Street");
const Village = require("../../model/area/Village");
class LocationService {

  async queryProvinces() {
    const provinces = await Province.findAll();
    return provinces;
  }

  async queryCities(provinceCode) {
    const cities = await City.findAll({ where: { provinceCode } });
    console.log(cities);
    
    return cities;
  }

  async queryAreas(cityCode) {
    const areas = await Areas.findAll({ where: { cityCode } });
    return areas;
  }

  async queryStreets(areaCode) {
    const streets = await Street.findAll({ where: { areaCode } });
    return streets;
  }
  
  async queryVillages(streetCode) {
    const villages = await Village.findAll({ where: { streetCode } });
    return villages;
  }
}

module.exports = new LocationService();

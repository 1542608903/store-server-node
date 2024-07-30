const Goods = require('../model/goods');
class GoodsService {
    /**
     * 
     * @param {number} id -表id
     * @returns 
     */
    async findByPk(id) {
        const res = await Goods.findByPk(id);
        return res
    }
    async createGoods(goods) {
        const res = await Goods.create(goods);
        return res.dataValues;
    }
    async updateGoods(id, goods) {
        const res = await Goods.update(goods, { where: { id } });
        return res[0] > 0 ? true : false;
    }
    async removeGoods(id) {
        const res = await Goods.destroy({ where: { id } });
        return res > 0 ? true : false;
    }
    async restoreGoods(id) {
        const res = await Goods.restore({ where: { id } });
        return res > 0 ? true : false;
    }
    async findGoods(pageNum, pageSize) {
        const offset = (pageNum - 1) * pageSize;
        const { count, rows } = await Goods.findAndCountAll({
            offset: offset,
            limit: +pageSize,
        })
        //3.返回数据
        return {
            pageNum,
            pageSize,
            total: count,
            list: rows,
        }
    }
}
module.exports = new GoodsService()
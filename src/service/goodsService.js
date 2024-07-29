const Goods = require('../model/goods');
class GoodsService {
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
        // //1.获取总数
        // const count = await Goods.count()
        // //2.获取分页的具体数据
        // const offset = (pageNum - 1) * pageSize;
        // const rows = await Goods.findAll({ offset: offset, limit: +pageSize });

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
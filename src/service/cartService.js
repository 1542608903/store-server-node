class CartService {
    async createOrUpdate(user_id, goods_id) {
        return {
            id: 1,
            user_id: 1,
            goods_id: 1,
            number: 1,
            selected: true,
        }
    }
}

module.exports = new CartService();
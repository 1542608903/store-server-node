const { createUser } = require('../service/userService')
class UseContrller {
    /**
     * 
     * @param ctx 
     * @param next 
     * @returns 
     */
    async register(ctx: any, next: any) {
        //1.获取数据
        console.log(ctx.request.body);
        const { user_name, password } = ctx.request.body
        //2.操作数据库
        const res = await createUser(user_name, password);
        
        return ctx.body = {
            code: '0',
            message: '用户注册成功',
            result: {
                id: res.id,
                user_name: res.user_name,
            },
        };
    }
    /**
     * 
     * @param ctx 
     * @param next 
     * @returns 
     */
    async login(ctx: any, next: any) {
        return ctx.body = '登录成功！'
    }
}

module.exports = new UseContrller()

const Koa = require('koa');
const app = new Koa()

app.use((ctx:any) => {
    ctx.body = 'hello Koa';
})

app.listen(3000, () => {
    return console.log('http://127.0.0.1:3000/');
}); 
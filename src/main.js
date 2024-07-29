const nodeApp  = require('./app')
const { APP_PORT } = require('./config/config.default')


nodeApp.listen(APP_PORT, () => {
    return console.log(`http://127.0.0.1:${APP_PORT}/`);
}); 
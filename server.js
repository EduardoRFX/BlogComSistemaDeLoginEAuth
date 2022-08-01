require('dotenv').config()

const app = require('./app');
const port = 8000;
const db = require('./database');
require('./redis/blacklist.js')

const routes = require('./rotas');
routes(app);

app.listen(port, () => console.log(`Servidor Conectado!`));

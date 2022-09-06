require('dotenv').config()

require('./redis/blocklist-access-token.js')
require('./redis/allowlist-refresh-token.js')
require('./database.js')

const app = require('./app');
const port = 8000;

const routes = require('./rotas');
routes(app);

app.listen(port, () => console.log(`Servidor Conectado!`));

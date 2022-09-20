require('dotenv').config()

const app = require('./app');
const port = 8000;
require('./database.js')
require('./redis/blocklist-access-token.js')
require('./redis/allowlist-refresh-token.js')
const { NaoAutorizado, NaoEncontrado, InvalidArgumentError } = require('./src/erros');
const jwt = require('jsonwebtoken');

app.use((req, res, next) => {
    res.set({
        'Content-Type': 'application/json'
    })

    next()
})
const routes = require('./rotas');
routes(app);

app.use((erro, req, res, next) => {
    let status = 500 
    const corpo = {
        mensagem: erro.message
    }

    if (erro instanceof NaoAutorizado) {
        status = 401
    }

    if (erro instanceof NaoEncontrado) {
        status = 404
    }

    if (erro instanceof InvalidArgumentError) {
        status = 400
    }

    if (erro instanceof jwt.JsonWebTokenError) {
        status = 401
    }

    if (erro instanceof jwt.TokenExpiredError) {
        status = 401
        corpo.expiradoEm = erro.expiredAt
    }

    res.status(status)
    res.json(corpo)
})

app.listen(port, () => console.log(`Servidor Conectado!`));

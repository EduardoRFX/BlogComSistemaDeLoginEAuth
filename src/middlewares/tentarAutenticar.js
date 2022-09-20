const { middlewaresAutenticacao } = require('../usuarios')
module.exports = (req, res, next) => {
    req.estaAutenticado = false

    if(req.get('Authorization')) {
        return middlewaresAutenticacao.bearer(req, res, next)
    }

    next()
}
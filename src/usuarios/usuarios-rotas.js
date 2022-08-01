const usuariosControlador = require('./usuarios-controlador');
const middlewaresAutenticacao = require('./middlewares-autenticacao.js')
// const passport = require('passport')

module.exports = app => {
  app
    .route('/usuario/login')
    .post(
      middlewaresAutenticacao.local,
      usuariosControlador.login
      )

  app
  .route('/usuario/logout')
  .get(middlewaresAutenticacao.bearer,usuariosControlador.logout)

  app
      .route('/usuario/email')
      .get(usuariosControlador.buscarPorEmail)

  app
      .route('/usuario/:id')
      .get(usuariosControlador.buscaPorId)
  
  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app.route('/usuario/:id')
    .delete(
      middlewaresAutenticacao.bearer,
      usuariosControlador.deleta);
};

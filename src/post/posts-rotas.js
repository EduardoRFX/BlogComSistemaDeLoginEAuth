const postsControlador = require('./posts-controlador');
const { middlewaresAutenticacao } = require('../usuarios/index.js')


module.exports = app => {
  app
    .route('/post')
    .get(postsControlador.lista)
    .post(
      middlewaresAutenticacao.bearer,
      postsControlador.adiciona);
};

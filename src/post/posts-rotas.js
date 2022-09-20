const postsControlador = require('./posts-controlador');
const { middlewaresAutenticacao } = require('../usuarios/index.js')
const autorizacao = require('../middlewares/autorizacao.js')
const tentarAutenticar = require('../middlewares/tentarAutenticar.js')
const tentarAutorizar = require('../middlewares/tentarAutorizar')

module.exports = app => {
  app
    .route('/post')
    .get(
      [tentarAutenticar, tentarAutorizar('post', 'ler')],
      postsControlador.lista
    )
    .post(
      [middlewaresAutenticacao.bearer, autorizacao('post', 'criar')],
      postsControlador.adiciona
    )
  
  app
    .route('/post/:id')
    .get(
      [middlewaresAutenticacao.bearer, autorizacao('post', 'ler')],
      postsControlador.obterDetalhes
    )
    .delete(
      [middlewaresAutenticacao.bearer, middlewaresAutenticacao.local, autorizacao('post', 'remover')],
      postsControlador.remover
    );
};

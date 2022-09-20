const postsDao = require('./posts-dao');
const validacoes = require('../validacoes-comuns');

class Post {
  constructor(post) {
    this.id = post.id
    this.titulo = post.titulo;
    this.conteudo = post.conteudo;
    this.autor = post.autor;
    this.valida();
  }

  adiciona() {
    return postsDao.adiciona(this);
  }

  static async buscaPorId (id) {
    const post = await postsDao.buscoPorId(id)
    if (!post) {
      return null
    }

    return new Post(post)
  }

  static async buscaPorIdAutor (id, idAutor) {
    const post = await postsDao.buscoPorId(id, idAutor)
    if (!post) {
      return null
    }

    return new Post(post)
  }

  valida() {
    validacoes.campoStringNaoNulo(this.titulo, 'título');
    validacoes.campoTamanhoMinimo(this.titulo, 'título', 5);

    validacoes.campoStringNaoNulo(this.conteudo, 'conteúdo');
    validacoes.campoTamanhoMaximo(this.conteudo, 'conteúdo', 140);
  }

  remover () {
    return postsDao.remover(this)
  }

  static listarPorAutor (idAutor) {
    return postsDao.listarPorAutor(idAutor)
  }

  static listarTodos() {
    return postsDao.listarTodos();
  }
}

module.exports = Post;

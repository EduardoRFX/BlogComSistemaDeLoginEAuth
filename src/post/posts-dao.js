const db = require('../../database');
const { InternalServerError } = require('../erros.js')

const { promisify } = require('util')
const dbRun = promisify(db.run).bind(db)
const dbAll = promisify(db.all).bind(db)

module.exports = {
  async adiciona(post){
      try {
        await dbRun(`INSERT INTO posts (titulo, conteudo) VALUES (?, ?)`,[
            post.titulo,
            post.conteudo
        ])

      }catch (erro) {
        throw new InternalServerError('Erro ao adicionar o posts!')
      }
  },

  async lista() {
      try {
        return await dbAll('SELECT * FROM posts')
      
      } catch (erro) {
        throw new InternalServerError('Erro ao listar os posts!')
      }
  }
};

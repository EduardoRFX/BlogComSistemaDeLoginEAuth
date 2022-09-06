const db = require('../../database');
const { InternalServerError } = require('../erros');

const { promisify } = require('util')

const dbRun = promisify(db.run).bind(db)
const dbGet = promisify(db.get).bind(db)
const dbAll = promisify(db.all).bind(db)


module.exports = {
  async adiciona (usuario) {
    try {
      await dbRun(
        `INSERT INTO usuarios (nome, email, senhaHash, emailVerificado)
        VALUES (?, ?, ?, ?)`,
        [usuario.nome, usuario.email, usuario.senhaHash, usuario.emailVerificado]
      )

    }catch (erro) {
      throw new InternalServerError('Erro ao adicionar o usuario')
    }

  },

  async buscaPorId (id) {
    try {
      return await dbGet (
          `SELECT * FROM usuarios WHERE id = ?`, [id]
      )

    } catch (erro) {
        throw new InternalServerError('Não foi possivel encontrar o usuario!')
    }
  },

  async buscaPorEmail (email) {
      try {
        return await dbGet(
          `SELECT * FROM usuarios WHERE email = ?`, [email]
        )

      }catch (erro) {
        throw new InternalServerError('Não foi possivel encontra o email!')
      }
  },

  async lista() {
      try {
        return await dbAll(
          `SELECT * FROM usuarios`
        )

      } catch (erro) {
        throw new InternalServerError('Erro ao listar os usuarios!')
      }
  },

  async modificaEmailVerificado(usuario, emailVerificado) {
    try {
      await dbRun(
          `UPDATE usuarios SET emailVerificado = ? WHERE id = ?`,
          [
            emailVerificado,
            usuario.id
          ]
      )

    }catch(erro) {
        throw new InternalServerError('Não foi possivel verificar o email!')
    }
  },

  async deleta (usuario) {
      try {
        await dbRun(
          `DELETE FROM usuarios WHERE id = ?`, [usuario.id]
        )

      }catch (erro) {
          throw new InternalServerError('Erro ao deletar o usuario!')
      }
  }
};

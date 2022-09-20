const redis = require('redis')
const conexao = redis.createClient({ prefix: 'redefinicao-de-senha ' })
const manipulaLista = require('./manipula-lista.js')

module.exports = manipulaLista(conexao)
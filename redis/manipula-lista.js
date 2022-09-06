const { promisify } = require('util')

module.exports = Lista => {
    const setAsync = promisify(Lista.set).bind(Lista)
    const existsAsync = promisify(Lista.exists).bind(Lista)
    const getAsync = promisify(Lista.get).bind(Lista)
    const delAsync = promisify(Lista.del).bind(Lista)

    return {

        async adiciona(chave, valor, dataExpiracao) {
            await setAsync(chave, valor)
            Lista.expireat(chave, dataExpiracao)
        },

        async buscaValor(chave) {
            return getAsync(chave)
        },

        async contemChave(chave) {
            const resultado = await existsAsync(chave)
            return resultado === 1
        },

        async deleta(chave) {
            await delAsync(chave)
        }
    }

}
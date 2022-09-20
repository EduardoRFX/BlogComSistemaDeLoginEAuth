class Conversor {
    converter (dados) {
        if (this.campoPublicos.indexOf('*') === -1) {
            dados = this.filtrar(dados)
        }

        if (this.tipoDeConteudo === 'json') {
            return this.json(dados)
        }
    }

    json (dados) {
        return JSON.stringify(dados)
    }

    filtrar (dados) {
        if (Array.isArray(dados)) {
            dados = dados.map((post) => this.filtrarObjeto(post))
        } else {
            dados = this.filtrarObjeto(dados)
        }

        return dados
    }

    filtrarObjeto (objeto) {
        const objetoFiltrado = {}

        this.campoPublicos.forEach((campo) => {
            if (Reflect.has(objeto, campo)) {
                objetoFiltrado[campo] = objeto[campo]
            }
        })

        return objetoFiltrado
    }
}

class ConversorPost extends Conversor {
    constructor (tipoDeConteudo, camposExtras = []) {
        super()
        this.tipoDeConteudo = tipoDeConteudo
        this.campoPublicos = ['titulo', 'conteudo'].concat(camposExtras)
    }
}

class ConversorUsuario extends Conversor {
    constructor (tipoDeConteudo, camposExtras = []) {
        super()
        this.tipoDeConteudo = tipoDeConteudo
        this.campoPublicos = ['nome'].concat(camposExtras)
    }
}

module.exports = { ConversorPost, ConversorUsuario }
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy

const Usuario = require('./usuarios-modelo.js')
const { InvalidArgumentError } = require('../erros.js')
const bcrypt = require('bcrypt')
const tokens = require('./tokens.js')


function verificaUsuario(usuario) {
    if (!usuario) {
        throw new InvalidArgumentError('Não existe usuário com esse e-mail')
    }
}

async function verificaSenha(senha, senhaHash) {
    const senhaValida = await bcrypt.compare(senha, senhaHash)
    if (!senhaValida) {
        throw new InvalidArgumentError('E-mail ou senha inválidos')
    }
}


passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'senha',
        session: false
    }, async (email, senha, done) => {
        try {
            const usuario = await Usuario.buscaPorEmail(email);
            verificaUsuario(usuario)
            await verificaSenha(senha, usuario.senhaHash)

            done(null, usuario);
        } catch (err) {
            done(err);
        }
    })
)

passport.use(
    new BearerStrategy(
        async (token, done) => {
            try {
                const id = await tokens.access.verifica(token)
                const usuario = await Usuario.buscaPorId(id)
                done(null, usuario, {token})

            } catch (err) {
                done(err)
            }
        }
    )
)
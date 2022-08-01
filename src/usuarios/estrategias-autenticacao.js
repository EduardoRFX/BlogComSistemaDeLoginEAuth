const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer')

const Usuario = require('./usuarios-modelo.js')
const { InvalidArgumentError } = require('../erros.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const blacklist = require('../../redis/manipula-blacklist.js')

function verificaUsuario(usuario) {
    if (!usuario) {
        throw new InvalidArgumentError('Não existe usuário com esse e-mail')
    }
}

async function verificaTokenNaBlacklist(token) {
   const tokenNaBlacklist = await blacklist.contemToken(token)
    if (tokenNaBlacklist) {
    throw new jwt.JsonWebTokenError('Token invalido por logout!')
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
                await verificaTokenNaBlacklist(token)
                const payload = jwt.verify(token, process.env.CHAVE_JWT)
                const usuario = await Usuario.buscaPorId(payload.id)
                done(null, usuario, { token: token })

            } catch (err) {
                done(err)
            }
        }
    )
)
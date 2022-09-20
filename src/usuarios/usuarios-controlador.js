const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, NaoEncontrado } = require('../erros');

const tokens = require('./tokens.js')
const { EmailVerificacao, EmailRedefinicaoSenha } = require('./emails.js')
const { ConversorUsuario } = require('../conversores')

function geraEndereco(rota, token) {
    const baseURL = process.env.BASE_URL
    return `${baseURL}${rota}${token}`
}

module.exports = {
  async adiciona(req, res) {
    const { nome, email, senhaHash, cargo } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        emailVerificado: false,
        cargo
      });

      await usuario.adicionaSenha(senhaHash)
      await usuario.adiciona();

      const token = tokens.verificacaoEmail.cria(usuario.id)

      const endereco = geraEndereco('/usuario/Verifica_email/', token)
      const emailVerificado = new EmailVerificacao(usuario, endereco)
      emailVerificado.enviaEmail().catch(console.log)

      res.status(201).json(usuario);

    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        return res.status(400).json({ erro: erro.message });
      } 
      res.status(500).json({ erro: erro.message })
    }
  },

  async login(req, res) {
    try {
      const accesstoken = tokens.access.cria(req.user.id)
      const refreshToken = await tokens.refresh.cria(req.user.id)
      res.set('Authorization', accesstoken)
      res.status(200).json({refreshToken})

    }catch (erro) {
      next(erro)
    }
  },

  async logout(req, res) {
    try{
      const token = req.token 
      await tokens.access.invalida(token)
      res.status(204).send('Logout Realizado!')

    } catch (erro) {
      next(erro)
    }
  },

  async lista(req, res, next) {
    try{
      const usuarios = await Usuario.lista();
      const conversor = new ConversorUsuario(
        'json',
        req.acesso.todos.permitido ? req.acesso.todos.atributos : req.acesso.apenasSeu.atributos
      )
      res.status(200).send(conversor.converter(usuarios));

    } catch (erro) {
      next(erro)
    }
  },

  async verificaEmail(req, res) {
    try {
        const usuario = req.user
        await usuario.verificaEmail()
        res.status(200).json({message: 'Seu E-mail foi verificado !'})

    } catch (erro) {
      next(erro)
    }
  },

  async deleta(req, res) {
    try {
      const usuario = await Usuario.buscaPorId(req.params.id);
      await usuario.deleta();
      res.status(200).json({ message: `Usuario Deletado com sucesso!` });

    } catch (erro) {
      next(erro)
    }
  },

  async esqueciMinhaSenha (req, res, next) {
    const respostaPadrao = {message: 'Se encontrarmos um usuario com este email, vamos enviar uma mensagem com as intruções para redefinir a senha'}
    try {
      const usuario = await Usuario.buscaPorEmail(req.body.email)
      const token = await tokens.redefinicaoDeSenha.criarToken(usuario.id)
      const email = new EmailRedefinicaoSenha(usuario, token)
      await email.enviaEmail()

      res.send(respostaPadrao)
    }catch (erro) {
      if (erro instanceof NaoEncontrado) {
        res.send(respostaPadrao)
        return 
      }

      next(erro)
    }
  },

  async trocarSenha(req, res, next) {
    try {
      if (typeof req.body.token !== 'string' || req.body.token.length === 0) {
        throw new InvalidArgumentError('O token está invalido')
      }

      const id = await tokens.redefinicaoDeSenha.verifica(req.body.token)
      const usuario = await Usuario.buscaPorId(id)
      await usuario.adicionaSenha(req.body.senha)
      await usuario.atualizarSenha()
      res.send({ message: 'Sua senha foi atualizada com sucesso!' })
    } catch(erro) {
      next(erro)
    }
  }
};

const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError } = require('../erros');

const tokens = require('./tokens.js')
const { EmailVerificacao } = require('./emails.js')

function geraEndereco(rota, token) {
    const baseURL = process.env.BASE_URL
    return `${baseURL}${rota}${token}`
}

module.exports = {
  async adiciona(req, res) {
    const { nome, email, senhaHash } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        emailVerificado: false
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
      res.status(500).json({erro: erro.message})
    }
  },

  async logout(req, res) {
    try{
      const token = req.token 
      await tokens.access.invalida(token)
      res.status(204).send('Logout Realizado!')

    } catch (erro) {
      res.status(500).json({ erro: erro.message })
    }
  },

  async lista(req, res) {
    try{
      const usuarios = await Usuario.lista();
      res.status(200).json(usuarios);

    } catch (erro) {
      res.status(500).json({ erro: erro.message })
    }
  },

  async verificaEmail(req, res) {
    try {
        const usuario = req.user
        await usuario.verificaEmail()
        res.status(200).json({message: 'Seu E-mail foi verificado !'})

    } catch (erro) {
      res.status(500).json({ erro: erro.message })
    }
  },

  async deleta(req, res) {
    try {
      const usuario = await Usuario.buscaPorId(req.params.id);
      await usuario.deleta();
      res.status(200).json({ message: `Usuario Deletado com sucesso!` });

    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  }
};

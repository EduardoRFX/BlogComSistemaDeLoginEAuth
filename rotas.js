const posts = require('./src/post');
const usuarios = require('./src/usuarios');

module.exports = app => {
  app.get('/', (req, res) => {res.json('Bem-vindo ao Sistema de Login')});
  
  posts.rotas(app);
  usuarios.rotas(app);
};
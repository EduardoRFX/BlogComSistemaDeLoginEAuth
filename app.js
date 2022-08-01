const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const { estrategiasAutenticacao } = require('./src/usuarios/index.js')

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = app;

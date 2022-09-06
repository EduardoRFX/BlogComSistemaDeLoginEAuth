const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Bem-vindo ao Sistema do Blog')
})

app.use(bodyParser.json())

module.exports = app;

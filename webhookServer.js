const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const webhookController = require('./controllers/webhookController');
const bot = require('./bot'); // Aqui é onde você instancia seu Telegraf

const app = express();
const PORT = process.env.PORT || 3000;

app.set('bot', bot); // Deixa o bot acessível nos controllers

app.use(bodyParser.json());

// Rota que GitHub vai chamar
app.post('/webhook', webhookController);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🌐 Webhook ativo em http://localhost:${PORT}/webhook`);
});
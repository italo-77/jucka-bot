const logger = require('./utils/logger');

app.listen(PORT, () => {
  log.success(`🌐 Webhook ouvindo na porta ${PORT}`);
});

app.use((err, req, res, next) => {
  log.error('🔥 Erro no servidor:', err.stack);
  res.status(500).send('Erro interno');
});

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const webhookController = require('./controllers/webhookController');
const bot = require('./bot');

const app = express();
const PORT = process.env.PORT || 3000;

// Segurança e logs HTTP bonitões
app.use(helmet());
app.use(morgan('dev'));
const crypto = require('crypto');

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Injeta o bot no app (acessível em req.app.get('bot'))
app.set('bot', bot);

// Endpoint GitHub → Webhook
app.post('/webhook', webhookController);

// Endpoint de teste (opcional)
app.get('/', (req, res) => res.send('🚀 Webhook online e operando.'));

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`🌐 Webhook disponível em http://localhost:${PORT}/webhook`);
});
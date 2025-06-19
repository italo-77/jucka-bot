
require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');
const app = express();
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const requiredEnv = [
  'TELEGRAM_TOKEN',
  'GITHUB_TOKEN',
  'GITHUB_USER',
  'GITHUB_REPO',
  'ADMIN_ID',
  'ADMIN_USERNAME',
  'OPENAIKEY',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY'
];

const githubHandlers = require('./services/github');
githubHandlers(bot);

const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error('❌ Variáveis de ambiente ausentes:', missing.join(', '));
  process.exit(1);
}

// Handlers
const fs = require('fs');
const path = require('path');

const handlersPath = path.join(__dirname, 'handlers');

function loadHandlers(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadHandlers(fullPath);
    } else if (file.endsWith('.js')) {
      const handler = require(fullPath);
      handler(bot);
      console.log(`✅ Handler carregado: ${path.relative(__dirname, fullPath)}`);
    }
  });
}

const { listarSugestoes } = require('./services/sugestoesSupabase');

bot.on('inline_query', async (ctx) => {
  const query = ctx.inlineQuery.query;

  if (query.startsWith('usuario ')) {
    const username = query.replace('usuario ', '').trim().toLowerCase();
    const todas = await listarSugestoes(100);

    const filtradas = todas.filter(s => s.usuario?.toLowerCase() === username);
    if (!filtradas.length) return;

    const results = filtradas.slice(0, 10).map((s, i) => ({
      type: 'article',
      id: `user-${i}`,
      title: `${s.arquivo}`,
      description: s.texto.slice(0, 80),
      input_message_content: {
        message_text: `📄 *${s.arquivo}* por ${s.usuario}\n\n${s.texto}`,
        parse_mode: 'Markdown'
      }
    }));

    await ctx.answerInlineQuery(results, { cache_time: 0 });
  }
});

loadHandlers(handlersPath);

// Agendamentos
require('./jobs/dailySummary')(bot);

// Configurar Webhook do Telegram
bot.telegram.setWebhook(`https://jucka-bot.onrender.com/bot${process.env.TELEGRAM_TOKEN}`);
app.use(bot.webhookCallback(`/bot${process.env.TELEGRAM_TOKEN}`));

// Iniciar servidor Express
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor rodando na porta ${PORT}`);
});

const comandos = require('./setup/commands');
bot.telegram.setMyCommands(comandos);
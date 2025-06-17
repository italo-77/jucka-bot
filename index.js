require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

// Configurações do bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Repositório alvo
const GITHUB_USER = 'octocat';
const GITHUB_REPO = 'Hello-World';

// Função para obter dados do GitHub
async function fetchBuildInfo() {
  const { data: commits } = await axios.get(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/commits`);
  const lastCommit = commits[0];
  return {
    message: lastCommit.commit.message,
    author: lastCommit.commit.author.name,
    date: lastCommit.commit.author.date
  };
}

// Calcula tempo fictício de build (exemplo)
function calcularTempoBuild() {
  const tempo = Math.floor(Math.random() * 5) + 1;
  return `${tempo} minutos`;
}

// Botões interativos
bot.start((ctx) => {
  ctx.reply(
    '👋 Bem-vindo! Escolha uma opção:',
    Markup.inlineKeyboard([
      [Markup.button.callback('⏱ Tempo de Build', 'buildtime')],
      [Markup.button.callback('📌 Último Commit', 'lastcommit')],
      [Markup.button.callback('✍️ Autor do Commit', 'commitauthor')],
      [Markup.button.callback('📝 Mensagem do Commit', 'commitmessage')],
    ])
  );
});

// Callback para tempo de build
bot.action('buildtime', async (ctx) => {
  await ctx.answerCbQuery();
  const tempo = calcularTempoBuild();
  ctx.reply(`⏱ Tempo médio de build: ${tempo}`);
});

// Callback para último commit
bot.action('lastcommit', async (ctx) => {
  await ctx.answerCbQuery();
  try {
    const { message, date } = await fetchBuildInfo();
    ctx.reply(`📌 Último commit:\n🕒 ${new Date(date).toLocaleString()}\n📝 ${message}`);
  } catch {
    ctx.reply('⚠️ Erro ao buscar último commit.');
  }
});

// Callback para autor
bot.action('commitauthor', async (ctx) => {
  await ctx.answerCbQuery();
  try {
    const { author } = await fetchBuildInfo();
    ctx.reply(`✍️ Autor do último commit: ${author}`);
  } catch {
    ctx.reply('⚠️ Erro ao buscar autor.');
  }
});

// Callback para mensagem do commit
bot.action('commitmessage', async (ctx) => {
  await ctx.answerCbQuery();
  try {
    const { message } = await fetchBuildInfo();
    ctx.reply(`📝 Mensagem do último commit:\n${message}`);
  } catch {
    ctx.reply('⚠️ Erro ao buscar mensagem do commit.');
  }
});

// Comando /help
bot.command('help', (ctx) => {
  ctx.reply(`📖 *Ajuda*:

Comandos disponíveis:
/start – Iniciar o bot
/help – Mostrar esta ajuda
/status – Verificar se o bot está online
/repos – Ver informações do repositório
/buildtime – Tempo médio de build
/lastcommit – Último commit
/commitauthor – Autor do commit
/commitmessage – Mensagem do commit
/painel – Abrir painel interativo

Você também pode usar os botões no menu.`, { parse_mode: 'Markdown' });
});

// Comando /status
bot.command('status', (ctx) => {
  ctx.reply('✅ O bot está online e funcionando corretamente.');
});

// Comando /repos
bot.command('repos', (ctx) => {
  ctx.reply(`📁 Repositório monitorado:\n🔗 https://github.com/${GITHUB_USER}/${GITHUB_REPO}`);
});

// Comando /lastcommit
bot.command('lastcommit', async (ctx) => {
  try {
    const { message, date } = await fetchBuildInfo();
    ctx.reply(`📌 Último commit:\n🕒 ${new Date(date).toLocaleString()}\n📝 ${message}`);
  } catch {
    ctx.reply('⚠️ Erro ao buscar último commit.');
  }
});

// Comando /commitauthor
bot.command('commitauthor', async (ctx) => {
  try {
    const { author } = await fetchBuildInfo();
    ctx.reply(`✍️ Autor do último commit: ${author}`);
  } catch {
    ctx.reply('⚠️ Erro ao buscar autor do commit.');
  }
});

// Comando /commitmessage
bot.command('commitmessage', async (ctx) => {
  try {
    const { message } = await fetchBuildInfo();
    ctx.reply(`📝 Mensagem do último commit:\n${message}`);
  } catch {
    ctx.reply('⚠️ Erro ao buscar mensagem do commit.');
  }
});

// Comando /buildtime
bot.command('buildtime', (ctx) => {
  const tempo = calcularTempoBuild();
  ctx.reply(`⏱ Tempo médio de build: ${tempo}`);
});

// Comando /painel
bot.command('painel', (ctx) => {
  ctx.reply(
    '📊 Painel Interativo:',
    Markup.inlineKeyboard([
      [Markup.button.callback('⏱ Tempo de Build', 'buildtime')],
      [Markup.button.callback('📌 Último Commit', 'lastcommit')],
      [Markup.button.callback('✍️ Autor do Commit', 'commitauthor')],
      [Markup.button.callback('📝 Mensagem do Commit', 'commitmessage')],
    ])
  );
});

// Inicializa o bot
bot.launch();
console.log('🤖 Bot está rodando...');

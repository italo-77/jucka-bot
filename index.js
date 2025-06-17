require('dotenv').config();
const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const cron = require('node-cron');
const os = require('os');


// (Opcional) OpenAI API para o módulo 5
const { Configuration, OpenAIApi } = require('openai');
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPEN_AI_KEY }));

const app = express();
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// === CONFIGURAÇÕES ===
const GITHUB_USER = 'italo-77';
const GITHUB_REPO = 'projeto-blog';
const ADMIN_ID = 7135330595; // Substitua pelo ID real
const START_TIME = new Date();

// PRS ABERTOS NO REPOSITÓRIO
bot.command('pullrequests', async (ctx) => {
  try {
    const axiosInstance = axios.create({
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    });

    const { data } = await axiosInstance.get(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/pulls`);

    if (data.length === 0) return ctx.reply('✅ Nenhum pull request aberto no momento.');

    const resposta = data.map(pr =>
      `🔀 *${pr.title}*\n👤 ${pr.user.login}\n📅 ${new Date(pr.created_at).toLocaleDateString('pt-BR')}\n🔗 ${pr.html_url}`
    ).join('\n\n');

    ctx.reply(`📂 *Pull Requests Abertos:*\n\n${resposta}`, { parse_mode: 'MarkdownV2' });

  } catch (err) {
    console.error('Erro ao buscar PRs:', err.message);
    ctx.reply('⚠️ Erro ao buscar PRs.');
  }
});

// TOP CONTRIBUINTES
bot.command('contributors', async (ctx) => {
  try {
    const { data } = await axios.get(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contributors`);
    const top = data.slice(0, 5).map(user =>
      `🏅 *${user.login}*: ${user.contributions} commits`
    ).join('\n');

    ctx.reply(`👥 *Top Contribuidores:*\n\n${top}`, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Erro ao buscar contribuidores:', err.message);
    ctx.reply('⚠️ Não foi possível carregar os contribuidores.');
  }
});

// VISÃO GERAL DAS ISSUIS
bot.command('issues', async (ctx) => {
  try {
    const { data: abertas } = await axios.get(`https://api.github.com/search/issues?q=repo:${GITHUB_USER}/${GITHUB_REPO}+type:issue+state:open`);
    const { data: fechadas } = await axios.get(`https://api.github.com/search/issues?q=repo:${GITHUB_USER}/${GITHUB_REPO}+type:issue+state:closed`);

    ctx.reply(`🐞 *Status das Issues:*\n🔓 Abertas: ${abertas.total_count}\n✅ Fechadas: ${fechadas.total_count}`, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Erro ao buscar issues:', err.message);
    ctx.reply('⚠️ Problema ao consultar as issues.');
  }
});

// TEMPO DOS ÚLTIMOS WORKFLOWS
bot.command('buildtime', async (ctx) => {
  try {
    const { data } = await axios.get(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/actions/runs?per_page=5`);
    const duracoes = data.workflow_runs.map(run =>
      (new Date(run.updated_at) - new Date(run.created_at)) / 1000
    );

    const media = (duracoes.reduce((a, b) => a + b, 0) / duracoes.length).toFixed(1);
    const minutos = Math.floor(media / 60);
    const segundos = Math.floor(media % 60);

    ctx.reply(`⏱️ Tempo médio dos últimos workflows: *${minutos}m ${segundos}s*`, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Erro em /buildtime:', err.message);
    ctx.reply('⚠️ Não foi possível calcular o tempo médio.');
  }
});

// TEMPO DESDE QUE O BOT ESTÁ NO AR
bot.command('uptime', (ctx) => {
  const agora = new Date();
  const uptime = Math.floor((agora - START_TIME) / 1000);
  const horas = Math.floor(uptime / 3600);
  const minutos = Math.floor((uptime % 3600) / 60);
  const segundos = uptime % 60;

  ctx.reply(`🕒 Bot rodando há *${horas}h ${minutos}m ${segundos}s*`, { parse_mode: 'Markdown' });
});

// SIMULA OU ACIONA O DEPLOY
bot.command('deploy', (ctx) => {
  if (!ctx.from || ctx.from.id !== ADMIN_ID) return ctx.reply('🔐 Apenas administradores.');

  ctx.reply('🚀 Iniciando processo de deploy...\n(Obs: Aqui você pode acoplar uma chamada a API de CI/CD, como o GitHub Dispatch ou Webhook)');
});

// AGENDAR RESUMO DIÁRIO 
bot.command('agendar', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('🔐 Apenas administradores podem usar esse comando.');
  ctx.reply('📅 Notificações diárias ativadas com sucesso! ✅');
});

// Agendamento às 9h de segunda a sexta
cron.schedule('0 9 * * 1-5', async () => {
  try {
    const { data: commits } = await axios.get(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/commits`);
    const { data: prs } = await axios.get(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/pulls`);
    const { data } = await axios.get(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/actions/runs?per_page=1`);
    const status = data.workflow_runs[0].conclusion === 'success' ? '✅ OK' : '❌ Falhou';

    bot.telegram.sendMessage(
      ADMIN_ID,
      `📬 *Resumo Diário (${new Date().toLocaleDateString()}):*\n- Commits recentes: ${commits.length}\n- PRs abertos: ${prs.length}\n- Último workflow: ${status}`,
      { parse_mode: 'Markdown' }
    );
  } catch (err) {
    console.error('Erro no agendamento diário:', err.message);
  }
});

// WEBHOOK
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor Express ouvindo na porta ${PORT}`);
});

app.post('/webhook/github', express.json(), (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  if (event === 'pull_request' && payload.action === 'opened') {
    bot.telegram.sendMessage(
      ADMIN_ID,
      `🔔 Novo PR criado: *${payload.pull_request.title}* por ${payload.sender.login}\n🔗 ${payload.pull_request.html_url}`,
      { parse_mode: 'Markdown' }
    );
  }

if (event === 'push') {
  const commits = payload.commits.map(commit => `• "${commit.message}" por ${commit.author.name}`).join('\n');
  bot.telegram.sendMessage(
    ADMIN_ID,
    `📦 Novo *push* com ${payload.commits.length} commit(s):\n\n${commits}`,
    { parse_mode: 'Markdown' }
  );
}

  res.status(200).send('ok');
});

// MENU PRINCIPAL
bot.command('painel', (ctx) => {
  ctx.reply('🔧 *Painel Principal*', {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('⚙️ CI/CD', 'painel_ci'), Markup.button.callback('🧩 Repositório', 'painel_repo')],
      [Markup.button.callback('👑 Admin', 'painel_admin')]
    ])
  });
});

// Webhook do Telegram (fora do webhook do GitHub)
bot.telegram.setWebhook('https://jucka-bot.onrender.com/bot' + process.env.TELEGRAM_TOKEN);
app.use(bot.webhookCallback('/bot' + process.env.TELEGRAM_TOKEN));

// MENU CI/CD
bot.action('painel_ci', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('⚙️ *Painel CI/CD*', {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('📦 Status', 'status')],
      [Markup.button.callback('⏱ Tempo de Build', 'buildtime')],
      [Markup.button.callback('📊 Relatório', 'relatorio')]
    ])
  });
});

// MENU REPOSITÓRIO
bot.action('painel_repo', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('📁 *Painel do Repositório*', {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('📝 Último Commit', 'ultimocommit')],
      [Markup.button.callback('🔀 Pull Requests', 'pullrequests')],
      [Markup.button.callback('🐞 Issues', 'issues')],
      [Markup.button.callback('🏅 Contribuidores', 'contributors')]
    ])
  });
});

// MENU ADMIN
bot.action('painel_admin', (ctx) => {
  ctx.answerCbQuery();
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('🔐 Acesso restrito.');

  ctx.reply('👑 *Painel Administrativo*', {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('🚀 Deploy', 'deploy')],
      [Markup.button.callback('🕒 Uptime', 'uptime')],
      [Markup.button.callback('📬 Agendar Notificações', 'agendar')]
    ])
  });
});

// DISPARAR COMANDOS EXISTENTES COMO SE O USUÁRIO TIVESSE DIGITADO

bot.action('buildtime', async (ctx) => {
  ctx.answerCbQuery();
  ctx.message.text = '/buildtime';
  await bot.handleUpdate(ctx.update);
});

bot.action('pullrequests', async (ctx) => {
  ctx.answerCbQuery();
  ctx.message.text = '/pullrequests';
  await bot.handleUpdate(ctx.update);
});

bot.action('issues', async (ctx) => {
  ctx.answerCbQuery();
  ctx.message.text = '/issues';
  await bot.handleUpdate(ctx.update);
});

bot.action('contributors', async (ctx) => {
  ctx.answerCbQuery();
  ctx.message.text = '/contributors';
  await bot.handleUpdate(ctx.update);
});

bot.action('uptime', async (ctx) => {
  ctx.answerCbQuery();
  ctx.message.text = '/uptime';
  await bot.handleUpdate(ctx.update);
});

bot.action('deploy', async (ctx) => {
  ctx.answerCbQuery();
  ctx.message.text = '/deploy';
  await bot.handleUpdate(ctx.update);
});

bot.action('agendar', async (ctx) => {
  ctx.answerCbQuery();
  ctx.message.text = '/agendar';
  await bot.handleUpdate(ctx.update);
});

// Função opcional para escapar caracteres do Markdown (se quiser usar em respostas formatadas)
function escaparMarkdownV2(texto) {
  return texto
    .replace(/_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(//g, '\')
    .replace(//g, '\')
    .replace(//g, '\')
    .replace(//g, '\')
    .replace(/~/g, '\\~')
    .replace(/`/g, '\\`')
    .replace(/>/g, '\\>')
    .replace(/#/g, '\\#')
    .replace(/\+/g, '\\+')
    .replace(/-/g, '\\-')
    .replace(/=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\./g, '\\.')
    .replace(/!/g, '\\!');
}

// COMANDO /melhorias
bot.command('melhorias', async (ctx) => {
  ctx.reply('🔍 Buscando melhorias com IA...');
  try {
    const { data } = await axios.get(`https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/README.md`);
    
    const resposta = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Você é um engenheiro de software experiente em sugerir melhorias para projetos.' },
        { role: 'user', content: `Sugira melhorias técnicas para este README.md:\n\n${data}` }
      ],
      temperature: 0.6,
      max_tokens: 500
    });

    const sugestoes = resposta.data.choices[0].message.content;
    ctx.reply(`🛠 *Sugestões de melhoria:*\n\n${sugestoes}`, { parse_mode: 'Markdown' });

  } catch (err) {
    console.error('Erro ao buscar melhorias:', err.message);
    ctx.reply('⚠️ Erro ao sugerir melhorias com IA.');
  }
});

// COMANDO /resumoai
bot.command('resumoai', async (ctx) => {
  try {
    const { data } = await axios.get(`https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/README.md`);

    const resposta = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Você é um especialista DevOps que resume documentação de projetos.' },
        { role: 'user', content: `Resuma tecnicamente este README.md:\n\n${data}` }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const resumo = resposta.data.choices[0].message.content;
    ctx.reply(`🧾 *Resumo técnico:*\n\n${resumo}`, { parse_mode: 'Markdown' });

  } catch (err) {
    console.error('Erro em /resumoai:', err.message);
    ctx.reply('⚠️ Erro ao gerar resumo com IA.');
  }
});
bot.launch();

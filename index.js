require('dotenv').config();
const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const cron = require('node-cron');
const os = require('os');

// Verifica se a chave da OpenAI está presente
if (!process.env.OPEN_AI_KEY) {
  console.warn('⚠️ OPEN_AI_KEY não definida no .env. A API da OpenAI não será inicializada.');
} else {
  const { Configuration, OpenAIApi } = require('openai');
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPEN_AI_KEY,
    })
  );

// === CONFIGURAÇÕES ===
const GITHUB_USER = 'italo-77';
const GITHUB_REPO = 'projeto-blog';
const ADMIN_ID = 7135330595; // Substitua pelo ID real
const START_TIME = new Date();


// PRS ABERTOS NO REPOSITÓRIO
bot.command('pullrequests', async (ctx) => {
  try {
    const { data } = await axios.get(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/pulls`);
    if (data.length === 0) return ctx.reply('✅ Nenhum pull request aberto no momento.');

    const resposta = data.map(pr =>
      `🔀 *${pr.title}*\n👤 ${pr.user.login}\n📅 ${new Date(pr.created_at).toLocaleDateString('pt-BR')}\n🔗 ${pr.html_url}`
    ).join('\n\n');

    ctx.reply(`📂 *Pull Requests Abertos:*\n\n${resposta}`, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Erro ao buscar PRs:', err.message);
    ctx.reply('⚠️ Não foi possível obter os PRs.');
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
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('🔐 Apenas administradores.');

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
      `🚀 *Push detectado no repositório ${payload.repository.name}*\n📦 Branch: ${payload.ref.replace('refs/heads/', '')}\n${commits}`,
      { parse_mode: 'Markdown' }
    );
  }

  res.sendStatus(200);
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

// STATUS BUILD, TEMPO DE EXECUÇÃO
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

// MENU REPO: COMMITS, PRS, ISSUIS, CONTRIBUIÇÃO
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

// GERA UM RESUMO TÉCNICO DO HEADME
bot.command('resumoai', async (ctx) => {
  ctx.reply('📖 Lendo README e gerando resumo com IA...');

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


// MELHORIAS
function escaparMarkdownV2(texto) {
  return texto
    .replace(/_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
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

bot.command('melhorias', async (ctx) => {
  ctx.reply('🔍 Buscando melhorias com IA...');

  try {
    const { data } = await axios.get(`https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/README.md`);

    const resposta = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Você é um engenheiro de software experiente. Seu trabalho é revisar repositórios e sugerir melhorias técnicas.' },
        { role: 'user', content: `Sugira melhorias e boas práticas para este repositório com base no README:\n\n${data}` }
      ],
      temperature: 0.7,
      max_tokens: 600
    });

    const sugestoes = resposta.data.choices[0].message.content;
    const textoSeguro = escaparMarkdownV2(sugestoes); // <- uso correto aqui

    ctx.reply(`💡 *Sugestões de melhoria:*\n\n${textoSeguro}`, {
      parse_mode: 'MarkdownV2'
    });

  } catch (err) {
    console.error('Erro em /melhorias:', err.message);
    ctx.reply('⚠️ Erro ao gerar sugestões de melhorias com IA.');
  }
});

bot.action('buildtime', ctx => ctx.telegram.sendMessage(ctx.chat.id, '/buildtime'));

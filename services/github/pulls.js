// services/github/pulls.js
const axios = require('axios');
const config = require('../../config/config');

const auth = {
  headers: { Authorization: `token ${config.GITHUB_TOKEN}` }
};

const pullRequests = async (ctx) => {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/pulls`,
      auth
    );

    if (!data.length) return ctx.reply('✅ Nenhum pull request aberto no momento.');

    const resposta = data.map(pr =>
      `🔀 *${pr.title}*\n👤 ${pr.user.login}\n📅 ${new Date(pr.created_at).toLocaleDateString('pt-BR')}\n🔗 ${pr.html_url}`
    ).join('\n\n');

    await ctx.replyWithMarkdown(`📂 *Pull Requests Abertos:*\n\n${resposta}`);
  } catch (err) {
    console.error('Erro ao buscar PRs:', err.message);
    ctx.reply('⚠️ Erro ao buscar PRs.');
  }
};

// Registra o comando no bot
module.exports = (bot) => {
  bot.command('pullrequests', pullRequests);
};

// Exporta a função para reuso, se necessário
module.exports.pullRequests = pullRequests;
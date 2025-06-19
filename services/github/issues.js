// services/github/issues.js
const axios = require('axios');
const config = require('../../config/config');

const auth = {
  headers: { Authorization: `token ${config.GITHUB_TOKEN}` }
};

const issues = async (ctx) => {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/issues?state=open`,
      auth
    );

    if (!data.length) return ctx.reply('✅ Nenhuma issue aberta no momento.');

    const lista = data.slice(0, 5).map(issue =>
      `🐞 *${issue.title}*\n🔗 ${issue.html_url}`
    ).join('\n\n');

    await ctx.replyWithMarkdown(`📋 *Issues Abertas:*\n\n${lista}`);
  } catch (err) {
    console.error('Erro em issues:', err.message);
    ctx.reply('⚠️ Não foi possível buscar issues.');
  }
};

module.exports = (bot) => {
  bot.command('issues', issues);
};

// caso queira usar essa função manualmente em outro lugar:
module.exports.issues = issues;
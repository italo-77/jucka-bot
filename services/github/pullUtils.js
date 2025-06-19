const axios = require('axios');
const config = require('../../config/config');

const auth = {
  headers: {
    Authorization: `token ${config.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json'
  }
};

async function listPullRequests(ctx) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/pulls?state=open`,
      auth
    );

    if (!data.length) {
      return ctx.reply('📭 Nenhum pull request aberto no momento.');
    }

    const resposta = data
      .slice(0, 5)
      .map(pr => `🔹 [${pr.title}](${pr.html_url}) – @${pr.user.login}`)
      .join('\n');

    await ctx.replyWithMarkdown(`*Pull Requests abertos:*\n${resposta}`);
  } catch (err) {
    console.error('Erro em listPullRequests:', err.message);
    ctx.reply('⚠️ Erro ao buscar pull requests.');
  }
}

module.exports = { listPullRequests };
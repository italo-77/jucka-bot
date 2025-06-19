const axios = require('axios');
const config = require('../../config/config');

const auth = {
  headers: {
    Authorization: `token ${config.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json'
  }
};

async function listIssues(ctx) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/issues?state=open`,
      auth
    );

    const issues = data.filter(item => !item.pull_request); // Excluir PRs

    if (!issues.length) {
      return ctx.reply('📭 Nenhuma issue aberta no momento.');
    }

    const resposta = issues
      .slice(0, 5)
      .map(issue => `🔹 [#${issue.number} - ${issue.title}](${issue.html_url})`)
      .join('\n');

    await ctx.replyWithMarkdown(`*Issues abertas:*\n${resposta}`);
  } catch (err) {
    console.error('Erro em listIssues:', err.message);
    ctx.reply('⚠️ Não foi possível buscar as issues.');
  }
}

module.exports = { listIssues };
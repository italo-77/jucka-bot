const axios = require('axios');
const config = require('../../config/config');

const auth = {
  headers: {
    Authorization: `token ${config.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json'
  }
};

async function topContributors(ctx) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/contributors`,
      auth
    );

    const resposta = data
      .slice(0, 5)
      .map((user, i) => `🏅 ${i + 1}. [${user.login}](${user.html_url}) – ${user.contributions} contribuições`)
      .join('\n');

    await ctx.replyWithMarkdown(`*Top Contribuidores:*\n${resposta}`);
  } catch (err) {
    console.error('Erro em topContributors:', err.message);
    ctx.reply('⚠️ Não foi possível buscar os contribuidores.');
  }
}

module.exports = { topContributors };
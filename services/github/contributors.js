const axios = require('axios');
const config = require('../../config/config');

const auth = {
  headers: { Authorization: `token ${config.GITHUB_TOKEN}` }
};

const contributors = async (ctx) => {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/contributors`,
      auth
    );

    const top = data.slice(0, 5).map((dev, index) =>
      `#${index + 1} 👤 *${dev.login}* – 📦 ${dev.contributions} contribuições`
    ).join('\n');

    await ctx.replyWithMarkdown(`🏆 *Top Contribuidores:*\n\n${top}`);
  } catch (err) {
    console.error('Erro em contributors:', err.message);
    ctx.reply('⚠️ Não foi possível buscar contribuidores.');
  }
};

module.exports = (bot) => {
  bot.command('contributors', contributors);
};

module.exports.contributors = contributors;
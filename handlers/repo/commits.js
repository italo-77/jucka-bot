const axios = require('axios');
const config = require('../../config/config');

module.exports = (bot) => {
  bot.command('commits', async (ctx) => {
    try {
      const url = `https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/commits`;
      const headers = {
        headers: { Authorization: `token ${config.GITHUB_TOKEN}` }
      };

      const { data } = await axios.get(url, headers);
      const ultimos = data.slice(0, 3); // Mostra só os 3 últimos commits

      for (const commit of ultimos) {
        const mensagem = commit.commit.message.split('\n')[0];
        const autor = commit.commit.author.name;
        const dataFormatada = new Date(commit.commit.author.date).toLocaleDateString('pt-BR');
        const sha = commit.sha.substring(0, 7);
        const commitUrl = commit.html_url;

        await ctx.replyWithMarkdownV2(
          `🔹 *${mensagem}*\n👤 ${autor} | ${dataFormatada}\n🔢 SHA: \`${sha}\``,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: '🔍 Ver Diff', url: commitUrl }]
              ]
            },
            disable_web_page_preview: true
          }
        );
      }

    } catch (err) {
      console.error('Erro ao buscar commits:', err.message);
      ctx.reply('⚠️ Não foi possível buscar os commits.');
    }
  });
};
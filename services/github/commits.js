const axios = require('axios');
const config = require('../../config/config');

const auth = {
  headers: { Authorization: `token ${config.GITHUB_TOKEN}` }
};

exports.commits = async (ctx) => {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/commits`,
      auth
    );

    const ultimos = data.slice(0, 3);

    for (const commit of ultimos) {
      const mensagem = commit.commit.message.split('\n')[0];
      const autor = commit.commit.author.name;
      const dataFormatada = new Date(commit.commit.author.date).toLocaleDateString('pt-BR');
      const sha = commit.sha.substring(0, 7);
      const url = commit.html_url;

      await ctx.replyWithMarkdownV2(
        `🔹 *${mensagem}*\n👤 ${autor} | ${dataFormatada}\n🔢 SHA: \`${sha}\``,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🔍 Ver Diff', url }]
            ]
          },
          disable_web_page_preview: true
        }
      );
    }
  } catch (err) {
    console.error('Erro em commits:', err.message);
    ctx.reply('⚠️ Não foi possível buscar os commits.');
  }
};
const axios = require('axios');
const config = require('../../config/config');

const auth = {
  headers: {
    Authorization: `token ${config.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json'
  }
};

async function lastCommit(ctx) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/commits`,
      auth
    );

    const commit = data?.[0];
    if (!commit) return ctx.reply('📭 Nenhum commit encontrado.');

    const msg = `
📌 *Último Commit*  
🧑‍💻 Autor: ${commit.commit.author.name}  
📝 Mensagem: ${commit.commit.message}  
🗓️ Data: ${new Date(commit.commit.author.date).toLocaleString('pt-BR')}  
🔗 [Ver no GitHub](${commit.html_url})
    `.trim();

    await ctx.replyWithMarkdown(msg);
  } catch (err) {
    console.error('Erro em lastCommit:', err.message);
    ctx.reply('⚠️ Erro ao buscar último commit.');
  }
}

module.exports = { lastCommit };
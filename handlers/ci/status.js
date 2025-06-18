const axios = require('axios');
const config = require('../../config/config');

module.exports = (bot) => {
  bot.command('status', async (ctx) => {
    try {
      const { data } = await axios.get(
        `https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/actions/runs?per_page=1`,
        { headers: { Authorization: `token ${config.GITHUB_TOKEN}` } }
      );

      const run = data.workflow_runs?.[0];
      const status = run?.conclusion === 'success' ? '✅ Último build bem-sucedido!' : '❌ Último build falhou.';
      ctx.reply(`🛠️ ${status}`);
    } catch (err) {
      console.error('Erro em /status:', err.message);
      ctx.reply('⚠️ Não foi possível verificar o status do CI.');
    }
  });
};
const axios = require('axios');
const config = require('../config/config');

module.exports = (bot) => {
  bot.command('status', async (ctx) => {
    try {
      const { data } = await axios.get(
        `https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/actions/runs?per_page=1`,
        {
          headers: {
            Authorization: `token ${config.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json'
          }
        }
      );

      const run = data.workflow_runs?.[0];
      if (!run) return ctx.reply('📭 Nenhuma execução de workflow encontrada.');

      const statusMap = {
        success: '✅ Sucesso',
        failure: '❌ Falhou',
        cancelled: '🚫 Cancelado',
        in_progress: '🔄 Em andamento',
        queued: '⏳ Em fila'
      };

      const status = run?.conclusion || run?.status;
      const icone = statusMap[status] || '❔ Desconhecido';

      const iniciado = new Date(run.created_at).toLocaleString('pt-BR');
      const finalizado = new Date(run.updated_at).toLocaleString('pt-BR');

      const resposta = `
🛠️ *Status do CI*
${icone}

📅 Início: ${iniciado}
🏁 Fim: ${finalizado}
🔗 [Ver detalhes do build](${run.html_url})
      `.trim();

      await ctx.replyWithMarkdown(resposta);
    } catch (err) {
      console.error('Erro em /status:', err.message);
      ctx.reply('⚠️ Não foi possível verificar o status do CI.');
    }
  });
};
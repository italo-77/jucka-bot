const cron = require('node-cron');
const axios = require('axios');
const config = require('../config/config');

const auth = {
  headers: { Authorization: `token ${config.GITHUB_TOKEN}` }
};

module.exports = (bot) => {
  cron.schedule('0 9 * * 1-5', async () => {
    try {
      const [commitsRes, prsRes, workflowRes] = await Promise.all([
        axios.get(`https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/commits`, auth),
        axios.get(`https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/pulls`, auth),
        axios.get(`https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/actions/runs?per_page=1`, auth)
      ]);

      const ultimoWorkflow = workflowRes.data.workflow_runs?.[0];
      const status = ultimoWorkflow?.conclusion === 'success' ? '✅ OK' : '❌ Falhou';

      const mensagem = `📬 *Resumo Diário* (${new Date().toLocaleDateString('pt-BR')}):\n- Commits recentes: ${commitsRes.data.length}\n- PRs abertos: ${prsRes.data.length}\n- Último workflow: ${status}`;

      await bot.telegram.sendMessage(config.ADMIN_ID, mensagem, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error('Erro ao enviar resumo diário:', err.message);
    }
  });
};
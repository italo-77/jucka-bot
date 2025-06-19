const cron = require('node-cron');
const axios = require('axios');
const config = require('./config/config');
const supabase = require('../services/supabase'); // 👈 Import do Supabase

// Verificação defensiva
const faltandoEnv = ['GITHUB_TOKEN', 'GITHUB_USER', 'GITHUB_REPO', 'ADMIN_ID'].filter(
  key => !process.env[key]
);

if (faltandoEnv.length > 0) {
  console.warn(`⚠️ Variáveis de ambiente ausentes: ${faltandoEnv.join(', ')}`);
}

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

      const totalCommits = commitsRes.data.length;
      const totalPRs = prsRes.data.length;
      const ultimoPR = prsRes.data[0];
      const workflow = workflowRes.data.workflow_runs?.[0];

      const status = workflow?.conclusion === 'success' ? '✅ Sucesso' :
                     workflow?.conclusion === 'failure' ? '❌ Falha' :
                     workflow?.conclusion || '⚠️ Desconhecido';

      const linkWorkflow = workflow?.html_url || null;
      const dataFormatada = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const mensagem = `
📬 *Resumo Diário* — *${dataFormatada}*

🧾 *Commits recentes:* ${totalCommits}
🔀 *PRs abertos:* ${totalPRs}${ultimoPR ? `\n📌 Último PR: _${ultimoPR.title}_\n🔗 ${ultimoPR.html_url}` : ''}
⚙️ *Último workflow:* ${status}
🔗 ${linkWorkflow || 'Sem link disponível'}
      `.trim();

      // Envia mensagem no Telegram
      await bot.telegram.sendMessage(config.ADMIN_ID, mensagem, { parse_mode: 'Markdown' });

      // Salva no Supabase
      await supabase.from('resumos_diarios').insert([{
        data_envio: new Date().toISOString().slice(0, 10),
        total_commits: totalCommits,
        total_prs: totalPRs,
        titulo_ultimo_pr: ultimoPR?.title || null,
        link_ultimo_pr: ultimoPR?.html_url || null,
        status_workflow: status,
        link_workflow: linkWorkflow,
        mensagem
      }]);

      console.log('📌 Resumo diário salvo no Supabase!');
    } catch (err) {
      console.error('❌ Erro ao executar ou salvar resumo diário:', err.message);
    }
  });
};
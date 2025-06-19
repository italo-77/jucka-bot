const axios = require('axios');
const config = require('../../config/config');

const auth = {
  headers: {
    Authorization: `token ${config.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json'
  }
};

async function buildTime(ctx) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/actions/runs?status=completed&per_page=20`,
      auth
    );

    const tempos = data.workflow_runs
      .filter(run => run.conclusion === 'success')
      .map(run => (new Date(run.updated_at) - new Date(run.created_at)) / 1000);

    if (!tempos.length) return ctx.reply('📭 Nenhum build bem-sucedido encontrado.');

    const media = tempos.reduce((a, b) => a + b, 0) / tempos.length;
    const min = Math.floor(media / 60);
    const seg = Math.round(media % 60);
    const tempoFormatado = `${min}m${seg.toString().padStart(2, '0')}s`;

    let desempenho = '';
    if (media < 90) desempenho = '🟢 Excelente';
    else if (media < 150) desempenho = '🟡 Boa performance';
    else if (media < 240) desempenho = '🟠 A melhorar';
    else desempenho = '🔴 Lento';

    const resposta = `
⏱️ *Tempo médio de build:* ${tempoFormatado}  
🧪 Analisado sobre: últimos ${tempos.length} builds  
📈 Desempenho: ${desempenho}
    `.trim();

    await ctx.replyWithMarkdown(resposta);
  } catch (err) {
    console.error('Erro em buildTime:', err.message);
    ctx.reply('⚠️ Erro ao calcular tempo médio.');
  }
}

async function statusWorkflow(ctx) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/actions/runs?per_page=1`,
      auth
    );

    const run = data.workflow_runs?.[0];
    if (!run) return ctx.reply('📭 Nenhum workflow encontrado.');

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
    console.error('Erro em statusWorkflow:', err.message);
    ctx.reply('⚠️ Erro ao buscar status do CI.');
  }
}

module.exports = {
  buildTime,
  statusWorkflow
};
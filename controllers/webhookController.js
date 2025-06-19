const crypto = require('crypto');
const config = require('./config/config');

console.log(`📩 Evento recebido do GitHub: ${evento}`);

module.exports = async (req, res) => {
  const bot = req.app.get('bot');
  const signature = req.headers['x-hub-signature-256'];
const secret = config.GITHUB_WEBHOOK_SECRET;

if (!signature || !secret) {
  return res.sendStatus(403);
}

const expected = 'sha256=' + crypto
  .createHmac('sha256', secret)
  .update(req.rawBody)
  .digest('hex');

if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
  console.warn('⛔ Assinatura inválida recebida!');
  return res.sendStatus(403);
}
  const evento = req.headers['x-github-event'];
  const payload = req.body;

  try {
    // 📦 Novo Pull Request aberto
    if (evento === 'pull_request' && payload.action === 'opened') {
      const pr = payload.pull_request;
      const labels = pr.labels.map(l => l.name);
      const bug = labels.includes('bug') ? '🐛' : '';
      const msg = `
${bug} *Novo PR aberto:*
📝 ${pr.title}
👤 ${pr.user.login}
🔗 [Abrir PR](${pr.html_url})
      `.trim();

      await bot.telegram.sendMessage(config.ADMIN_ID, msg, { parse_mode: 'Markdown' });
      
      console.log(`📦 Novo Pull Request aberto: ${pr.title} por ${pr.user.login}`);

    }

// 📤 Push para a branch main, com commits nomeados
if (evento === 'push' && payload.ref.endsWith('/main')) {
  const autor = payload.pusher?.name || 'Desconhecido';
  const commits = payload.commits?.slice(0, 5).map((commit) =>
    `• \`${commit.id.slice(0, 7)}\` – ${commit.message.split('\n')[0]} (por ${commit.author.name})`
  ).join('\n');

  const texto = `
📤 *Push detectado na branch* \`main\`
👤 Autor do push: ${autor}

${commits || '— Nenhum commit encontrado.'}
  `.trim();
  
  console.log(`📤 Push para main por ${autor} com ${payload.commits.length} commits`);


  await bot.telegram.sendMessage(config.ADMIN_ID, texto, { parse_mode: 'Markdown' });
}

    // ✅ Status do CI: sucesso ou erro
    if (evento === 'workflow_run' && payload.action === 'completed') {
      const { conclusion, name, html_url, head_branch } = payload.workflow_run;
      const icone = {
        success: '✅', failure: '❌', cancelled: '🚫', neutral: '⚪'
      }[conclusion] || '❔';

      const texto = `
🛠️ *Workflow finalizado:* \`${name}\`
🔀 Branch: \`${head_branch}\`
📈 Resultado: ${icone} ${conclusion.toUpperCase()}
🔗 [Ver detalhes](${html_url})
      `.trim();

      await bot.telegram.sendMessage(config.ADMIN_ID, texto, { parse_mode: 'Markdown' });
    }

    res.sendStatus(200);
  } catch (err) {
    
    console.log (`🛠️ CI concluído: ${conclusion} em ${head_branch}`);
    res.sendStatus(500);
  }
};
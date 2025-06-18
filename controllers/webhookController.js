const config = require('../config/config');

module.exports = async (req, res) => {
  const bot = req.app.get('bot'); // Pegamos o bot do app (injeção no server)
  const evento = req.headers['x-github-event'];
  const payload = req.body;

  try {
    if (evento === 'pull_request' && payload.action === 'opened') {
      const pr = payload.pull_request;
      const titulo = pr.title;
      const autor = pr.user.login;
      const url = pr.html_url;

      const labels = pr.labels.map(l => l.name);
      const bug = labels.includes('bug') ? '🐛' : '';
      const mensagem = `${bug} *Novo PR aberto:*\n📝 ${titulo}\n👤 ${autor}\n🔗 [Ver PR](${url})`;

      await bot.telegram.sendMessage(config.ADMIN_ID, mensagem, { parse_mode: 'Markdown' });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Erro no webhook:', err.message);
    res.sendStatus(500);
  }
};
const express = require('express');

module.exports = (app, bot) => {
  app.post('/webhook/github', express.json(), (req, res) => {
    const event = req.headers['x-github-event'];
    const payload = req.body;
    const ADMIN_ID = parseInt(process.env.ADMIN_ID);

    // Notificação de PR criado
    if (event === 'pull_request' && payload.action === 'opened') {
      const pr = payload.pull_request;
      const mensagem = `🔔 *Novo PR criado:* ${pr.title} por ${payload.sender.login}\n🔗 ${pr.html_url}`;
      bot.telegram.sendMessage(ADMIN_ID, mensagem, { parse_mode: 'Markdown' });
    }

    // Notificação de push
    if (event === 'push') {
      const commits = payload.commits
        .map(commit => `• "${commit.message}" por ${commit.author.name}`)
        .join('\n');

      const mensagem = `📦 *Push detectado com ${payload.commits.length} commit(s):*\n\n${commits}`;
      bot.telegram.sendMessage(ADMIN_ID, mensagem, { parse_mode: 'Markdown' });
    }

    res.status(200).send('ok');
  });
};
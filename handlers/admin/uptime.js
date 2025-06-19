const START_TIME = new Date();

module.exports = (bot) => {
  bot.command('uptime', (ctx) => {
    const now = new Date();
    const uptimeSec = Math.floor((now - START_TIME) / 1000);
    const h = Math.floor(uptimeSec / 3600);
    const m = Math.floor((uptimeSec % 3600) / 60);
    const s = uptimeSec % 60;

    const formatUptime = (h, m, s) => {
      const partes = [];
      if (h) partes.push(`${h}h`);
      if (m) partes.push(`${m}m`);
      if (s || partes.length === 0) partes.push(`${s}s`);
      return partes.join(' ');
    };

    ctx.replyWithMarkdown(`🕒 *Bot rodando há:* ${formatUptime(h, m, s)}`);
  });
};
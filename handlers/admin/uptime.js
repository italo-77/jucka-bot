const START_TIME = new Date();

module.exports = (bot) => {
  bot.command('uptime', (ctx) => {
    const now = new Date();
    const uptimeSec = Math.floor((now - START_TIME) / 1000);
    const h = Math.floor(uptimeSec / 3600);
    const m = Math.floor((uptimeSec % 3600) / 60);
    const s = uptimeSec % 60;

    ctx.replyWithMarkdown(`🕒 *Bot rodando há:* ${h}h ${m}m ${s}s`);
  });
};
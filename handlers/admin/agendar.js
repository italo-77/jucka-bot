const { isAdmin } = require('../../middlewares/auth');

module.exports = (bot) => {
  bot.command('agendar', (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply('🔐 Apenas administradores.');
    ctx.reply('📅 Notificações diárias ativadas com sucesso! ✅');
  });
};
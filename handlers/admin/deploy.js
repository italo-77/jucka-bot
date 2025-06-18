const { isAdmin } = require('../../middlewares/auth');

module.exports = (bot) => {
  bot.command('deploy', (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply('🔐 Apenas administradores.');
    ctx.reply('🚀 Iniciando processo de deploy...\n(Obs: aqui você pode acoplar uma API CI/CD)');
  });
};
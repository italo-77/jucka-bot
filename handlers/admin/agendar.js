const { isAdmin } = require('../../middlewares/auth');
const { iniciarAgenda } = require('../../services/agendamento');
const { gerarResumoDoDia } = require('../../services/resumosIA'); // exemplo

module.exports = (bot) => {
  bot.command('agendar', async (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply('🔐 Apenas administradores.');

    iniciarAgenda(async () => {
      // Você pode customizar o comportamento aqui
      const resumo = await gerarResumoDoDia();
      bot.telegram.sendMessage(ctx.chat.id, `📝 *Resumo diário:*\n\n${resumo}`, {
        parse_mode: 'Markdown'
      });
    });

    ctx.reply('📅 Resumos diários agendados com sucesso! Enviaremos às 8h. ✅');
  });
};
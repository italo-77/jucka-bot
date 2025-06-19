const { isAdmin } = require('../../middlewares/auth');
const { dispararDeploy } = require('../../services/deployWebhook');
const { salvarStatus, ultimoDeploy } = require('../../services/deployStatus');

module.exports = (bot) => {
  // Comando /deploy
  bot.command('deploy', async (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply('🔐 Apenas administradores.');

    const msg = await ctx.reply('🚀 Disparando pipeline de deploy...');

    try {
      const resultado = await dispararDeploy();
      await salvarStatus(resultado);

      const tempo = new Date(resultado.concluido_em).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric'
      });

      const resposta = `
📦 *Último deploy:* ${tempo}
✅ *Status:* ${resultado.status}
🔗 ${resultado.url || 'Sem link'}
      `.trim();

      await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, resposta, {
        parse_mode: 'Markdown'
      });
    } catch (err) {
      console.error('Erro no deploy:', err.message);
      ctx.reply('❌ Falha ao acionar o deploy.');
    }
  });

  // Comando /statusdeploy
  bot.command('statusdeploy', async (ctx) => {
    try {
      const info = await ultimoDeploy();
      if (!info) return ctx.reply('📭 Nenhum deploy registrado ainda.');

      const data = new Date(info.concluido_em).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric'
      });

      const resposta = `
📦 *Último deploy:* ${data}
✅ *Status:* ${info.status}
🔗 ${info.url || 'Sem link disponível'}
      `.trim();

      const teclado = {
        inline_keyboard: [
          [{ text: '🔁 Repetir deploy', callback_data: 'deploy_repetir' }]
        ]
      };

      await ctx.replyWithMarkdown(resposta, { reply_markup: teclado });
    } catch (err) {
      console.error('Erro em /statusdeploy:', err.message);
      ctx.reply('⚠️ Erro ao buscar status do deploy.');
    }
  });

  // Callback de botão
  bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;
    if (data !== 'deploy_repetir') return;

    if (!isAdmin(ctx)) {
      return ctx.answerCbQuery('🔐 Acesso restrito.', { show_alert: true });
    }

    await ctx.answerCbQuery('🔁 Repetindo deploy...');
    bot.handleUpdate({ message: { ...ctx.callbackQuery.message, text: '/deploy' } });
  });
};
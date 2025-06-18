const { listarSugestoes } = require('../../services/sugestoesFirebase');

module.exports = (bot) => {
  bot.command('tarefas', async (ctx) => {
    const tarefas = await listarSugestoes(50);
    const usuario = ctx.from.username?.toLowerCase();

    const minhas = tarefas.filter(t => t.usuario?.toLowerCase() === usuario);
    if (!minhas.length) return ctx.reply('📭 Você não possui tarefas salvas.');

    for (const [index, t] of minhas.entries()) {
      await ctx.replyWithMarkdown(
        `📌 *${t.arquivo}*\n\n${t.texto}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '✅ Concluir', callback_data: `concluir:${index}` },
                { text: '🔁 Reagendar', callback_data: `reagendar:${index}` }
              ]
            ]
          }
        }
      );
    }
  });

  bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;

    if (data.startsWith('concluir:')) {
      await ctx.answerCbQuery('✅ Marcada como concluída!');
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
      await ctx.reply('🎉 Missão concluída, sensei.');
    }

    if (data.startsWith('reagendar:')) {
      await ctx.answerCbQuery('⏳ Tarefa reagendada para amanhã (simulado)');
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
    }
  });
};
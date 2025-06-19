const ai = require('../../services/openai');
const { protegerAdmin } = require('../middleware/auth');

module.exports = (bot) => {
  bot.command('resumoai', protegerAdmin(async (ctx) => {
    try {
      const msg = await ctx.reply('⏳ Gerando resumo com IA...');

      const resumo = await ai.analisarReadme('resumo');

      await ctx.telegram.editMessageText(
        ctx.chat.id,
        msg.message_id,
        null,
        `🧾 *Resumo técnico:*\n\n${resumo}`,
        { parse_mode: 'Markdown' }
      );
    } catch (err) {
      console.error('Erro em /resumoai:', err.message);
      ctx.reply('⚠️ Erro ao gerar resumo com IA.');
    }
  }));
};
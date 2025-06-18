const ai = require('../../services/openai');

module.exports = (bot) => {
  bot.command('resumoai', async (ctx) => {
    try {
      const resumo = await ai.analisarReadme('resumo');
      ctx.replyWithMarkdown(`🧾 *Resumo técnico:*\n\n${resumo}`);
    } catch (err) {
      console.error('Erro em /resumoai:', err.message);
      ctx.reply('⚠️ Erro ao gerar resumo com IA.');
    }
  });
};
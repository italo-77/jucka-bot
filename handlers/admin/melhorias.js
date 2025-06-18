const ai = require('../../services/openai');

module.exports = (bot) => {
  bot.command('melhorias', async (ctx) => {
    ctx.reply('🔍 Buscando melhorias com IA...');
    try {
      const sugestao = await ai.analisarReadme('melhorias');
      ctx.replyWithMarkdown(`🛠 *Sugestões de melhoria:*\n\n${sugestao}`);
    } catch (err) {
      console.error('Erro em /melhorias:', err.message);
      ctx.reply('⚠️ Erro ao sugerir melhorias com IA.');
    }
  });
};
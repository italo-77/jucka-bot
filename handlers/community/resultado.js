const votos = require('../../votosState'); // Exporta/compartilha o objeto votos de forma modular

module.exports = (bot) => {
  bot.command('resultado', async (ctx) => {
    const votoChat = votos.get(ctx.chat.id);
    if (!votoChat) return ctx.reply('⚠️ Nenhuma votação em andamento.');

    const contagem = Array(votoChat.opcoes.length).fill(0);
    Object.values(votoChat.registro).forEach(i => contagem[i]++);

    const total = Object.keys(votoChat.registro).length;
    const placar = votoChat.opcoes.map((op, i) =>
      `🔸 ${op}: ${contagem[i]} voto${contagem[i] !== 1 ? 's' : ''}`
    ).join('\n');

    await ctx.replyWithMarkdown(`📊 *Placar atual:*\n\n${placar}\n\n🧮 Total: ${total} voto(s)`);
  });
};
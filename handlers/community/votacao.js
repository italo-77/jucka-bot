const votos = new Map(); // memória simples. Podemos salvar no Firebase depois

module.exports = (bot) => {
  bot.command('votacao', async (ctx) => {
    const pergunta = 'Qual funcionalidade deve vir primeiro?';
    const opcoes = ['🚀 Refatorar o código', '🧠 IA gerar README', '📊 Painel Web'];

    // Inicializa placar
    votos.set(ctx.chat.id, { pergunta, opcoes, registro: {} });

    await ctx.reply(`📢 *${pergunta}*`, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: opcoes.map((texto, i) => [
          { text: texto, callback_data: `voto:${i}` }
        ])
      }
    });
  });

  bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;

    if (!data.startsWith('voto:')) return;
    const escolha = parseInt(data.split(':')[1]);

    const chatId = ctx.chat.id;
    const userId = ctx.from.id;
    const votoChat = votos.get(chatId);
if (data.startsWith('voto:')) {
  const escolha = parseInt(data.split(':')[1]);
  const chatId = ctx.chat.id;
  const userId = ctx.from.id;
  const votoChat = votos.get(chatId);
  if (!votoChat) return ctx.answerCbQuery('Nenhuma votação ativa.');

  const jaVotou = votoChat.registro[userId] !== undefined;
  votoChat.registro[userId] = escolha;

  // Contagem
  const contagem = Array(votoChat.opcoes.length).fill(0);
  Object.values(votoChat.registro).forEach(i => contagem[i]++);

  const total = Object.keys(votoChat.registro).length;
  const placar = votoChat.opcoes.map((op, i) =>
    `${op}: ${contagem[i]} voto${contagem[i] !== 1 ? 's' : ''}`
  ).join('\n');

  await ctx.answerCbQuery(jaVotou ? '✅ Voto atualizado!' : '✅ Voto registrado!');
  await ctx.reply(`📊 *Parcial:*\n\n${placar}`, { parse_mode: 'Markdown' });
}
  });
};
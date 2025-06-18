const frases = [
  '⚙️ “Não é bug, é uma feature emergente.”',
  '🧘 “Refatorar é um ato de autoconhecimento.”',
  '🎭 “Se compila, é arte. Se testa, é engenharia.”',
  '☕ “Sem café, sem deploy.”',
  '🚧 “Prod é o novo staging.”',
  '📚 “Documentar é humano. Lembrar é ilusão.”',
  '😅 “Quem nunca fez commit na sexta não teme nada.”',
  '🌀 “Toda branch deseja voltar ao trunk.”',
  '🔑 “Senhas no código são portas abertas para o caos.”',
  '🤖 “Só é impossível até que um dev com sono resolve.”',
];

module.exports = (bot) => {
  bot.command('copilot', async (ctx) => {
    const index = Math.floor(Math.random() * frases.length);
    await ctx.reply(frases[index]);
  });
};
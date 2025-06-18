const { salvarSugestao, listarSugestoes } = require('../../services/sugestoesFirebase');

module.exports = (bot) => {
  bot.command('sugestoes', async (ctx) => {
    const dados = await listarSugestoes();
    if (!dados.length) return ctx.reply('Nenhuma sugestão encontrada na nuvem.');

    const resposta = dados.map(s => `📝 *${s.arquivo}* por ${s.usuario}\n${s.texto}`).join('\n\n');
    ctx.replyWithMarkdown(resposta);
  });
};
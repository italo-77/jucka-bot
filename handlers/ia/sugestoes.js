const { salvarSugestao, listarSugestoes } = require('../../services/sugestoesSupabase');

module.exports = (bot) => {
  bot.command('sugestoes', async (ctx) => {
    try {
      const dados = await listarSugestoes();

      if (!dados.length) {
        return ctx.reply('Nenhuma sugestão encontrada na nuvem.');
      }

      const resposta = dados.map(s => `📝 *${s.arquivo}* por ${s.usuario}\n${s.texto}`).join('\n\n');

      await ctx.replyWithMarkdown(resposta);
    } catch (error) {
      console.error('Erro ao listar sugestões:', error.message);
      await ctx.reply('⚠️ Houve um problema ao buscar as sugestões.');
    }
  });
};
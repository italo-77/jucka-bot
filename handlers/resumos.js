const supabase = require('../services/supabase');

module.exports = (bot) => {
  bot.command('resumos', async (ctx) => {
    try {
      const { data, error } = await supabase
        .from('resumos_diarios')
        .select('*')
        .order('data_envio', { ascending: false })
        .limit(3);

      if (error) throw new Error(error.message);
      if (!data || !data.length) {
        return ctx.reply('📭 Nenhum resumo disponível ainda.');
      }

      const mensagens = data.map((r) => {
        return `📅 *${new Date(r.data_envio).toLocaleDateString('pt-BR')}*\n\n${r.mensagem}`;
      });

      for (const msg of mensagens) {
        await ctx.replyWithMarkdown(msg);
      }
    } catch (err) {
      console.error('Erro ao buscar resumos:', err.message);
      ctx.reply('⚠️ Erro ao buscar resumos. Tente novamente mais tarde.');
    }
  });
};
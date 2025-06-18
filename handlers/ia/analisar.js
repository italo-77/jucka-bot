const ai = require('../../services/openai');
const { salvarSugestao } = require('../../services/sugestoesFirebase');

module.exports = (bot) => {
  const arquivos = ['README', 'package.json', 'Testes', 'Outro'];

  bot.command('analisar', async (ctx) => {
    ctx.session ??= {};
    ctx.session.step = 'aguardando_selecao';

    await ctx.reply('📂 Escolha o que você quer analisar:', {
      reply_markup: {
        inline_keyboard: arquivos.map(item => ([{
          text: `🔎 ${item}`,
          callback_data: `analisar:${item}`
        }]))
      }
    });
  });

  bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;

    if (data.startsWith('analisar:')) {
      const alvo = data.split(':')[1];
      ctx.session.step = null;

      await ctx.answerCbQuery();
      await ctx.editMessageText(`🔍 Analisando *${alvo}* com IA...`, { parse_mode: 'Markdown' });

      try {
        const sugestao = await ai.analisarReadme(alvo);

        ctx.session.alvo = alvo;
        ctx.session.sugestao = sugestao;

        await ctx.replyWithMarkdown(`🛠 *Sugestões para ${alvo}:*\n\n${sugestao}`, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '✅ Aplicar', callback_data: 'aplicar_sugestao' },
                { text: '❌ Ignorar', callback_data: 'ignorar_sugestao' }
              ]
            ]
          }
        });
      } catch (err) {
        console.error('Erro ao analisar:', err.message);
        await ctx.reply('⚠️ Houve um erro ao processar a análise.');
      }
    }

    if (data === 'aplicar_sugestao') {
      await ctx.answerCbQuery('Aplicando...');

      await salvarSugestao(
        ctx.from?.username || 'desconhecido',
        ctx.session?.alvo || 'não especificado',
        ctx.session?.sugestao || 'sem texto'
      );

      await ctx.editMessageText('✅ Sugestões aplicadas e salvas com sucesso!');
    }

    if (data === 'ignorar_sugestao') {
      await ctx.answerCbQuery('Ignorado.');
      await ctx.editMessageText('👌 Sugestões ignoradas.');
    }
  });
};
const ai = require('../../services/openai');
const { salvarSugestao } = require('../../services/sugestoesFirebase');

module.exports = (bot) => {
  bot.command('menu', async (ctx) => {
    await ctx.reply('🛠️ O que você quer fazer?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📄 Ver tarefas', callback_data: 'ver_tarefas' }],
          [{ text: '➕ Criar nova tarefa', callback_data: 'nova_tarefa' }],
          [{ text: '📝 Planejar com IA', callback_data: 'fluxo_planejar' }]
        ]
      }
    });
  });

  bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;
    ctx.session ??= {};

    if (data === 'fluxo_planejar') {
      await ctx.answerCbQuery();
      ctx.session.step = 'esperando_nome_arquivo';
      await ctx.reply('📂 Qual o nome do planejamento? (ex: Auth, Sprint 12)');
    }

    if (data === 'ver_tarefas') {
      await ctx.answerCbQuery();
      await ctx.reply('📋 (aqui listaremos as tarefas salvas futuramente)');
    }

    if (data === 'nova_tarefa') {
      await ctx.answerCbQuery();
      ctx.session.step = 'criando_tarefa_manual';
      await ctx.reply('✍️ Digite a tarefa que deseja adicionar:');
    }
  });

  bot.on('text', async (ctx) => {
    ctx.session ??= {};

    if (ctx.session.step === 'criando_tarefa_manual') {
      ctx.session.step = null;
      return await ctx.reply(`✅ Tarefa adicionada: *${ctx.message.text}*`, { parse_mode: 'Markdown' });
    }

    if (ctx.session.step === 'esperando_nome_arquivo') {
      ctx.session.arquivo = ctx.message.text;
      ctx.session.step = 'esperando_descricao_planejamento';
      return await ctx.reply('🧠 O que você gostaria de planejar com IA?');
    }

    if (ctx.session.step === 'esperando_descricao_planejamento') {
      const alvo = ctx.session.arquivo;
      const textoBase = ctx.message.text;

      await ctx.reply(`🤖 Planejando com IA... Aguarde alguns segundos.`);

      try {
        const sugestao = await ai.planejarTarefa(textoBase);

        ctx.session.step = null;

        // Salva no Firestore
        await salvarSugestao(ctx.from.username, alvo, sugestao);

        await ctx.replyWithMarkdown(
          `📋 *Plano para:* ${alvo}\n\n${sugestao}`
        );
      } catch (err) {
        console.error('Erro IA planejamento:', err.message);
        await ctx.reply('⚠️ Houve um erro ao planejar com IA.');
      }
    }
  });
};
const { listarSugestoes } = require('../../services/sugestoesFirebase');
const fs = require('fs');

module.exports = (bot) => {
  bot.command('admin', async (ctx) => {
    if (ctx.from.username !== process.env.ADMIN_USERNAME) {
      return ctx.reply('⚠️ Somente o Sensei pode acessar este painel.');
    }

    await ctx.reply('🔐 *Painel Admin – Escolha uma ação:*', {
      parse_mode: 'Markdown',
      reply_markup: {
      inline_keyboard: [
      [{ text: '🧠 Ver 5 sugestões', callback_data: 'admin_pagina:1' }],
      [{ text: '🔍 Buscar por arquivo', switch_inline_query_current_chat: 'buscar ' }],
      [{ text: '👤 Ver sugestões por usuário', switch_inline_query_current_chat: 'usuario ' }],
  [{ text: '📤 Exportar .json', callback_data: 'admin_exportar' }]
]
      }
    });
  });

  bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;

    // Paginação
    if (data.startsWith('admin_pagina:')) {
      await ctx.answerCbQuery();
      const pagina = parseInt(data.split(':')[1], 10);
      const porPagina = 5;
      const todas = await listarSugestoes(50); // traga até 50
      const inicio = (pagina - 1) * porPagina;
      const paginaDados = todas.slice(inicio, inicio + porPagina);

      if (!paginaDados.length) return ctx.reply('📭 Nada na página.');

      for (const s of paginaDados) {
        await ctx.replyWithMarkdown(`📌 *${s.arquivo}*\n👤 ${s.usuario}\n${s.texto}`);
      }

      const teclado = {
        inline_keyboard: [
          [{ text: '⬅️ Voltar', callback_data: `admin_pagina:${pagina - 1}` }],
          [{ text: '➡️ Próxima', callback_data: `admin_pagina:${pagina + 1}` }]
        ]
      };
      await ctx.reply('⏳ Mais registros?', { reply_markup: teclado });
    }

    // Exportar
    if (data === 'admin_exportar') {
      const tudo = await listarSugestoes(1000);
      const json = JSON.stringify(tudo, null, 2);
      const caminho = `tmp/sugestoes-${Date.now()}.json`;
      fs.writeFileSync(caminho, json);

      await ctx.answerCbQuery();
      await ctx.replyWithDocument({ source: caminho, filename: 'sugestoes.json' });
      fs.unlinkSync(caminho); // limpa
    }
  });
};
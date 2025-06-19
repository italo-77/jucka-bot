const { salvarSugestao, listarSugestoes } = require('../../services/sugestoesSupabase');
const fs = require('fs');

module.exports = (bot) => {
  bot.command('admin', async (ctx) => {
if (ctx.from.id !== parseInt(process.env.ADMIN_ID, 10)) {
  return ctx.reply('⚠️ Apenas o Sensei verdadeiro pode acessar este painel.');
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
  if (!data.startsWith('admin_')) return;

  await ctx.answerCbQuery();

  // Paginação
  if (data.startsWith('admin_pagina:')) {
    const pagina = parseInt(data.split(':')[1], 10);
    if (pagina < 1) return ctx.reply('⛔ Página inválida.');

    const porPagina = 5;
    const todas = await listarSugestoes(50);
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
  
  // EXPORTAR
if (data === 'admin_exportar') {
  const tudo = await listarSugestoes(1000);
  const json = JSON.stringify(tudo, null, 2);

  const path = require('path');
  const dir = path.join(__dirname, '../../tmp');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const caminho = path.join(dir, `sugestoes-${Date.now()}.json`);
  fs.writeFileSync(caminho, json);

  await ctx.replyWithDocument({ source: caminho, filename: 'sugestoes.json' });
  fs.unlinkSync(caminho); // limpa o arquivo temporário após envio
}
});
};
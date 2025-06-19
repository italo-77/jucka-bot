bot.start((ctx) => {
  ctx.reply('👋 Bem-vindo! Abertura do painel...');
  bot.handleUpdate({ message: { ...ctx.message, text: '/painel' } });
});

module.exports = (bot) => {
  // Comando /painel com teclado interativo
  bot.command('painel', (ctx) => {
    ctx.reply('📋 *Painel de Comandos Disponíveis:*', {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔀 Pull Requests', callback_data: 'painel_pr' },
            { text: '👥 Contribuidores', callback_data: 'painel_contrib' }
          ],
          [
            { text: '🐞 Issues', callback_data: 'painel_issues' },
            { text: '💬 Último Commit', callback_data: 'painel_commits' }
          ],
          [
            { text: '⏱️ Build Time', callback_data: 'painel_build' },
            { text: '📄 Status CI', callback_data: 'painel_status' }
          ],
          [
            { text: '🧠 IA: Resumo', callback_data: 'painel_resumo' },
            { text: '💡 IA: Melhorias', callback_data: 'painel_melhorias' }
          ],
          [
            { text: '🕒 Uptime', callback_data: 'painel_uptime' },
            { text: '🚀 Deploy', callback_data: 'painel_deploy' }
          ]
        ]
      }
    });
  });

  // Tratador de callback: simula execução de comandos
  bot.on('callback_query', async (ctx) => {
    const comandos = {
      painel_pr: '/pullrequests',
      painel_contrib: '/contributors',
      painel_issues: '/issues',
      painel_commits: '/commits',
      painel_build: '/buildtime',
      painel_status: '/status',
      painel_resumo: '/resumoai',
      painel_melhorias: '/melhorias',
      painel_uptime: '/uptime',
      painel_deploy: '/deploy'
    };

    const cmd = comandos[ctx.callbackQuery.data];
    if (!cmd) return ctx.answerCbQuery();

    await ctx.answerCbQuery('🔄 Executando...');
    bot.handleUpdate({ message: { ...ctx.callbackQuery.message, text: cmd } });
  });
};
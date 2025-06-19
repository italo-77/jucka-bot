module.exports = (bot) => {
  bot.command('help', (ctx) => {
    ctx.replyWithMarkdown(`
📘 *Ajuda Rápida – O que posso fazer por você?*

Use o comando /painel para acessar todos os recursos do bot com botões interativos. Ou, se preferir, aqui está a lista direta:

• /pullrequests – Ver PRs abertos no GitHub  
• /contributors – Top contribuidores do projeto  
• /issues – Issues abertas  
• /commits – Últimos commits  
• /buildtime – Tempo médio dos builds  
• /status – Status atual do CI  
• /resumoai – Resumo técnico com IA 🤖  
• /melhorias – Sugestões automáticas com IA 💡  
• /deploy – Aciona pipeline de deploy 🚀  
• /statusdeploy – Último deploy realizado  
• /uptime – Tempo de vida do bot  
• /painel – Painel de botões interativos  
• /help – Exibe esta ajuda  
    `.trim());
  });
};
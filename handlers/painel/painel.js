module.exports = (bot) => {
  bot.command('painel', (ctx) => {
    ctx.replyWithMarkdown(`📋 *Painel de Comandos Disponíveis:*

- /pullrequests → PRs abertos no repositório
- /contributors → Top contribuidores do projeto
- /issues → Issues abertas e fechadas
- /ultimocommit → Último commit feito
- /buildtime → Tempo médio de execução do CI
- /melhorias → Sugestões de melhorias via IA
- /resumoai → Resumo técnico do projeto
- /uptime → Tempo de vida do bot
- /deploy → Simula processo de deploy
`);
  });
};
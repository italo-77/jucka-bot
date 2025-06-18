const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const comandos = [
  { command: 'start', description: 'Inicia o bot' },
  { command: 'painel', description: 'Exibe comandos disponíveis' },
  { command: 'pullrequests', description: 'Ver PRs abertos no GitHub' },
  { command: 'contributors', description: 'Top contribuidores' },
  { command: 'issues', description: 'Status das issues' },
  { command: 'ultimocommit', description: 'Último commit feito' },
  { command: 'buildtime', description: 'Tempo médio do CI' },
  { command: 'resumoai', description: 'Resumo técnico via IA' },
  { command: 'melhorias', description: 'Sugestões via IA' },
  { command: 'uptime', description: 'Tempo online do bot' },
  { command: 'deploy', description: 'Simula deploy (admin)' },
  { command: 'agendar', description: 'Ativa resumos diários (admin)' }
];

(async () => {
  try {
    await bot.telegram.setMyCommands(comandos);
    console.log('✅ Slash commands registrados com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao registrar comandos:', err.message);
    process.exit(1);
  }
})();
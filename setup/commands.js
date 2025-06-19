const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const comandos = [
  { command: 'start', description: 'Apresenta o bot e dá as boas-vindas' },
  { command: 'painel', description: 'Lista todos os comandos disponíveis' },
  { command: 'pullrequests', description: 'Exibe os PRs abertos no repositório do GitHub' },
  { command: 'contributors', description: 'Mostra os principais contribuidores do projeto' },
  { command: 'issues', description: 'Retorna as issues abertas e seus títulos' },
  { command: 'ultimocommit', description: 'Detalha o commit mais recente no repositório' },
  { command: 'buildtime', description: 'Calcula o tempo médio de execução dos builds' },
  { command: 'status', description: 'Informa o status atual do último workflow do CI' },
  { command: 'resumoai', description: 'Gera um resumo técnico com base em IA' },
  { command: 'melhorias', description: 'Sugere melhorias técnicas baseadas em IA' },
  { command: 'uptime', description: 'Mostra há quanto tempo o bot está online' },
  { command: 'deploy', description: 'Executa uma simulação de deploy (restrito a admins)' },
  { command: 'statusdeploy', description: 'Exibe o status da última tentativa de deploy' },
  { command: 'agendar', description: 'Agenda o envio diário de resumos (restrito a admins)' }
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
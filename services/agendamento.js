const cron = require('node-cron');
let tarefa = null;

function iniciarAgenda(callback) {
  // Exemplo: às 8h da manhã todos os dias
  if (tarefa) tarefa.stop();

  tarefa = cron.schedule('0 8 * * *', callback, {
    scheduled: true,
    timezone: 'America/Sao_Paulo'
  });

  console.log('⏰ Agendamento ativado: resumos diários às 8h');
}

module.exports = { iniciarAgenda };
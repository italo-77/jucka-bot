const { buildTime, statusWorkflow } = require('./buildUtils');

module.exports = (bot) => {
  bot.command('builds', buildTime);
  bot.command('status', statusWorkflow);
};
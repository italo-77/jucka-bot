const github = require('../../services/github');

module.exports = (bot) => {
  bot.command('buildtime', github.buildTime);
};
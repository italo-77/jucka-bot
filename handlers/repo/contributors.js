const github = require('../../services/github');

module.exports = (bot) => {
  bot.command('contributors', github.contributors);
};
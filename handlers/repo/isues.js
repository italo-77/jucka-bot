const github = require('../../services/github');

module.exports = (bot) => {
  bot.command('issues', github.issues);
};
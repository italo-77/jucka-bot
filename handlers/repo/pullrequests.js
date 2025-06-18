const github = require('../../services/github');

module.exports = (bot) => {
  bot.command('pullrequests', github.pullRequests);
};
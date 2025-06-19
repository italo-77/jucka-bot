const github = require('../../services/github');

const github = require('../../services/github');

module.exports = (bot) => {
  bot.command('pullrequests', github.pullRequests);
};
bot.command('buildtime', github.buildTime);
bot.command('status', github.statusWorkflow);
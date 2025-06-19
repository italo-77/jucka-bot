const github = require('../../services/github');

bot.command('pullrequests', github.pullRequests);
bot.command('buildtime', github.buildTime);
bot.command('status', github.statusWorkflow);
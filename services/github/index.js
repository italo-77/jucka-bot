const { listPullRequests } = require('./pullUtils');
const { buildTime, statusWorkflow } = require('./buildUtils');
const { listIssues } = require('./issuesUtils');
const { lastCommit } = require('./commitsUtils');
const { topContributors } = require('./contributorsUtils');

module.exports = (bot) => {
  bot.command('pullrequests', listPullRequests);
  bot.command('buildtime', buildTime);
  bot.command('status', statusWorkflow);
  bot.command('issues', listIssues);
  bot.command('ultimocommit', lastCommit);
  bot.command('contributors', topContributors);
};
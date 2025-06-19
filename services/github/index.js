const { listPullRequests } = require('../../services/github/pullUtils');
const { buildTime, statusWorkflow } = require('../../services/github/buildUtils');
const { listIssues } = require('../../services/github/issuesUtils');
const { lastCommit } = require('../../services/github/commitsUtils');
const { topContributors } = require('../../services/github/contributorsUtils');

module.exports = (bot) => {
  bot.command('pullrequests', listPullRequests);
  bot.command('buildtime', buildTime);
  bot.command('status', statusWorkflow);
  bot.command('issues', listIssues);
  bot.command('ultimocommit', lastCommit);
  bot.command('contributors', topContributors);
};
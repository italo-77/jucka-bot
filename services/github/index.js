// services/github/index.js
const pulls = require('./pulls');
const builds = require('./builds');
const issues = require('./issues');
const commits = require('./commits');
const contributors = require('./contributors');

module.exports = (bot, github) => {
  pulls(bot, github);
  builds(bot, github);
  issues(bot, github);
  commits(bot, github);
  contributors(bot, github);
};
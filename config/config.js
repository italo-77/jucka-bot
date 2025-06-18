require('dotenv').config();

module.exports = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_USER: process.env.GITHUB_USER,
  GITHUB_REPO: process.env.GITHUB_REPO,
  ADMIN_ID: parseInt(process.env.ADMIN_ID),
  OPENAIKEY: process.env.OPENAIKEY
};
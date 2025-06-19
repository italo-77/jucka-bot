require('dotenv').config();

module.exports = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_USER: process.env.GITHUB_USER,
  GITHUB_REPO: process.env.GITHUB_REPO,
  ADMIN_ID: parseInt(process.env.ADMIN_ID),
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  OPENAIKEY: process.env.OPENAIKEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  PORT: process.env.PORT || 3000
};
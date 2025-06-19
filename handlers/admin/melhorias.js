const ai = require('../../services/openai');
const axios = require('axios');
const config = require('../config/config');
const { protegerAdmin } = require('../middleware/auth');

module.exports = (bot) => {
  bot.command('melhorias', protegerAdmin(async (ctx) => {
    try {
      const msg = await ctx.reply('🔍 Gerando melhorias com IA...');

      const sugestao = await ai.analisarReadme('melhorias');

      // Monta a issue para GitHub
      const issue = {
        title: '💡 Sugestões de melhoria para o README (gerado por IA)',
        body: sugestao,
        labels: ['💡 IA'],
        assignees: [config.GITHUB_USER]
      };

      const { data: issueData } = await axios.post(
        `https://api.github.com/repos/${config.GITHUB_USER}/${config.GITHUB_REPO}/issues`,
        issue,
        {
          headers: {
            Authorization: `token ${config.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json'
          }
        }
      );

      // Edita a mensagem original com o link da issue
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        msg.message_id,
        null,
        `🛠 *Sugestões de melhoria:* _(Issue criada com sucesso)_\n\n${sugestao}\n\n🔗 ${issueData.html_url}`,
        { parse_mode: 'Markdown' }
      );

    } catch (err) {
      console.error('❌ Erro em /melhorias:', err.message);
      ctx.reply('⚠️ Não consegui gerar melhorias ou criar a issue no GitHub.');
    }
  }));
};
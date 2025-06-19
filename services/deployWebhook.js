const axios = require('axios');
const config = require('./config/config');

module.exports.dispararDeploy = async () => {
  const resposta = await axios.post(config.DEPLOY_WEBHOOK_URL, {
    triggered_by: 'telegram_bot',
    timestamp: new Date().toISOString()
  });

  return {
    status: resposta.data.status || 'Desconhecido',
    url: resposta.data.pipeline_url || null,
    concluido_em: new Date()
  };
};
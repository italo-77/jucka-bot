
const fs = require('fs');
const path = require('path');

// ✅ Verificação de variáveis de ambiente
const requiredVars = [
  'TELEGRAM_TOKEN',
  'GITHUB_TOKEN',
  'GITHUB_USER',
  'GITHUB_REPO',
  'ADMIN_ID',
  'OPENAIKEY'
];

let hasError = false;

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Variável de ambiente não definida: ${key}`);
    hasError = true;
  }
});

const adminId = parseInt(process.env.ADMIN_ID, 10);
if (isNaN(adminId)) {
  console.error('❌ ADMIN_ID deve ser um número válido');
  hasError = true;
}

// ✅ Verificação de diretórios e arquivos essenciais
const pathsToCheck = [
  './handlers',
  './services/sugestoesFirebase.js',
  './webhooks/githubWebhook.js',
  './jobs/dailySummary.js'
];

pathsToCheck.forEach((relativePath) => {
  const fullPath = path.join(__dirname, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Caminho não encontrado: ${relativePath}`);
    hasError = true;
  }
});

if (hasError) {
  console.error('\n🚫 Falha na validação de ambiente e estrutura. Encerrando aplicação.');
  process.exit(1);
}

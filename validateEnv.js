// validateEnv.js

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

if (hasError) {
  console.error('🚫 Falha na validação das variáveis de ambiente. Encerrando a aplicação.');
  process.exit(1);
}

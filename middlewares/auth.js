const ADMIN_ID = process.env.ADMIN_ID ? parseInt(process.env.ADMIN_ID, 10) : null;

if (!ADMIN_ID) {
  console.warn('⚠️ ADMIN_ID não definido no .env. O middleware de autenticação pode não funcionar corretamente.');
}

function isAdmin(ctx) {
  return ctx.from && ctx.from.id === ADMIN_ID;
}

// Middleware completo para proteger comandos
function protegerAdmin(handler) {
  return (ctx, ...args) => {
    if (!isAdmin(ctx)) {
      return ctx.reply('🚫 Você não tem permissão para executar este comando.');
    }
    return handler(ctx, ...args);
  };
}

module.exports = { isAdmin, protegerAdmin };
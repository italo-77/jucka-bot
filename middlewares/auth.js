const ADMIN_ID = parseInt(process.env.ADMIN_ID);

exports.isAdmin = (ctx) => {
  return ctx.from && ctx.from.id === ADMIN_ID;
};
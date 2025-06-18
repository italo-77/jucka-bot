const db = require('./firebase');

async function salvarSugestao(usuario, arquivo, texto) {
  await db.collection('sugestoes').add({
    usuario,
    arquivo,
    texto,
    data: new Date().toISOString()
  });
}

async function listarSugestoes(limit = 5) {
  const snapshot = await db.collection('sugestoes')
    .orderBy('data', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(doc => doc.data());
}

module.exports = { salvarSugestao, listarSugestoes };
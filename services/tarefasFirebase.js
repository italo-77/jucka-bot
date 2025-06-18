const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

admin.initializeApp();
const db = getFirestore();
const colecao = db.collection('tarefasPlanejadas');

exports.salvarTarefaIA = async (usuario, arquivo, textoMarkdown) => {
  return await colecao.add({
    usuario,
    arquivo,
    texto: textoMarkdown,
    status: 'pendente',
    criadoEm: Date.now()
  });
};

exports.listarTarefasPorUsuario = async (usuario) => {
  const snapshot = await colecao
    .where('usuario', '==', usuario)
    .where('status', '==', 'pendente')
    .orderBy('criadoEm', 'desc')
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

exports.concluirTarefa = async (id) => {
  return await colecao.doc(id).update({
    status: 'concluída',
    concluidoEm: Date.now()
  });
};

exports.reagendarTarefa = async (id) => {
  const novaData = Date.now() + 24 * 60 * 60 * 1000;
  return await colecao.doc(id).update({
    criadoEm: novaData
  });
};

exports.excluirTarefa = async (id) => {
  return await colecao.doc(id).delete();
};
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const TABELA = 'tarefas_planejadas';

// Salva nova tarefa IA
async function salvarTarefaIA(usuario, arquivo, textoMarkdown) {
  const { error } = await supabase
    .from(TABELA)
    .insert([{
      usuario,
      arquivo,
      texto: textoMarkdown,
      status: 'pendente',
      criado_em: Date.now()
    }]);

  if (error) throw new Error(error.message);
}

// Lista tarefas pendentes de um usuário
async function listarTarefasPorUsuario(usuario) {
  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .eq('usuario', usuario)
    .eq('status', 'pendente')
    .order('criado_em', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Concluir tarefa
async function concluirTarefa(id) {
  const { error } = await supabase
    .from(TABELA)
    .update({
      status: 'concluída',
      concluido_em: Date.now()
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// Reagendar tarefa (para +24h)
async function reagendarTarefa(id) {
  const novaData = Date.now() + 24 * 60 * 60 * 1000;

  const { error } = await supabase
    .from(TABELA)
    .update({ criado_em: novaData })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// Excluir tarefa
async function excluirTarefa(id) {
  const { error } = await supabase
    .from(TABELA)
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

module.exports = {
  salvarTarefaIA,
  listarTarefasPorUsuario,
  concluirTarefa,
  reagendarTarefa,
  excluirTarefa
};
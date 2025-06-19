

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Salvar sugestão
async function salvarSugestao(usuario, arquivo, texto) {
  const { error } = await supabase
    .from('sugestoes')
    .insert([
      {
        usuario,
        arquivo,
        texto,
        data: new Date().toISOString()
      }
    ]);

  if (error) throw new Error(error.message);
}

// Listar sugestões com limite
async function listarSugestoes(limit = 5) {
  const { data, error } = await supabase
    .from('sugestoes')
    .select('*')
    .order('data', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data;
}

module.exports = { salvarSugestao, listarSugestoes };
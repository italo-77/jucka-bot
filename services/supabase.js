const { createClient } = require('@supabase/supabase-js');

// Validação das variáveis de ambiente
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ SUPABASE_URL ou SUPABASE_ANON_KEY não definidas no .env');
  process.exit(1); // Encerra a aplicação de forma segura
}

// Criação da instância
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🛡️ Supabase client inicializado com sucesso');

module.exports = supabase;
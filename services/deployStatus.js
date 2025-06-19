const supabase = require('./supabase');

module.exports.salvarStatus = async ({ status, url, concluido_em }) => {
  await supabase.from('deploy_status').insert([{ status, url, concluido_em }]);
};

module.exports.ultimoDeploy = async () => {
  const { data } = await supabase
    .from('deploy_status')
    .select('*')
    .order('concluido_em', { ascending: false })
    .limit(1);

  return data?.[0] || null;
};
const axios = require('axios');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAIKEY });

const USER = process.env.GITHUB_USER;
const REPO = process.env.GITHUB_REPO;

exports.analisarReadme = async (tipo) => {
  const { data: conteudo } = await axios.get(
    `https://raw.githubusercontent.com/${USER}/${REPO}/main/README.md`
  );

  const prompt = tipo === 'melhorias'
    ? 'Você é um engenheiro de software experiente. Sugira melhorias para este README.md:'
    : 'Você é um DevOps. Resuma tecnicamente este README.md:';

  const resposta = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: conteudo }
    ],
    temperature: 0.6,
    max_tokens: 500
  });

  return resposta.choices[0].message.content;
};

async function planejarTarefa(texto) {
  const prompt = `Divida esta tarefa em subtarefas organizadas com prazos estimados:\n\n"${texto}"`;
  // Chame a OpenAI ou outro modelo aqui
  return `1. Entender objetivo (1h)\n2. Criar estrutura base (2h)\n3. Testar entregas (1h)`; // mock por enquanto
}

module.exports = { planejarTarefa };
# 🤖 Telegram DevOps Bot

![Build Status](https://github.com/italo-77/projeto-blog/actions/workflows/main.yml/badge.svg)
![License](https://img.shields.io/github/license/italo-77/projeto-blog?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/italo-77/projeto-blog?style=flat-square)
![Open Issues](https://img.shields.io/github/issues/italo-77/projeto-blog?style=flat-square)

> Um bot inteligente e automatizado para Telegram que integra GitHub, CI/CD e OpenAI para simplificar processos DevOps.

---

## ⚙️ Funcionalidades

- 🔀 `/pullrequests`: lista os PRs abertos
- 🐞 `/issues`: mostra total de issues abertas e fechadas
- 🏅 `/contributors`: top contribuidores do projeto
- ⏱️ `/buildtime`: tempo médio de execução dos últimos workflows
- 🕒 `/uptime`: tempo de atividade do bot
- 👑 `/deploy`, `/agendar`: comandos administrativos protegidos
- 🤖 `/resumoai`: resumo técnico do README com OpenAI
- 💡 `/melhorias`: sugestões de boas práticas geradas por IA
- 🧭 `/painel`: acessa menus interativos com botões inline
- 📬 Agendamento diário (via cron) com resumo técnico pela manhã
- 🔔 Webhook para detectar eventos `push` e `pull_request`

---

## 🛠️ Tecnologias utilizadas

- Node.js + Telegraf
- Express + Axios
- GitHub REST API
- OpenAI GPT-3.5-Turbo
- Node-cron para tarefas agendadas

---

## 📄 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/italo-77/projeto-blog
cd projeto-blog
npm install
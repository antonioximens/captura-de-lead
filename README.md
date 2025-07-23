
# 📊 Lead Management API

API RESTful para captura, gerenciamento e organização de **leads**, com suporte a grupos e campanhas. Construída com **Node.js**, **Express**, **Prisma ORM** e validações usando **Zod**.

---

## 🚀 Funcionalidades

- 📥 **Cadastrar lead em campanha ou grupo**
- 🧮 **Listar leads com paginação, filtros e ordenação**
- 🔁 **Atualizar status de lead (com validação de arquivamento após 6 meses)**
- 🗑️ **Remover lead de um grupo ou campanha**
- 📎 **Relacionamento entre leads, grupos e campanhas**

---

## 🛠️ Tecnologias

- **Node.js / Express** – Backend com rotas REST
- **Prisma ORM** – Integração com banco de dados relacional
- **Zod** – Validação e parsing de schemas de requisição
- **TypeScript** – Tipagem estática e segurança em tempo de desenvolvimento

---

## 📦 Instalação

```bash
# Clone o projeto
git clone https://github.com/seu-usuario/lead-management-api.git
cd lead-management-api

# Instale as dependências
npm install

# Configure o banco de dados
npx prisma migrate dev --name init

# Inicie o servidor
npm run dev
```

## ✅ Futuras Melhorias

- 🔐 Autenticação com JWT
- 📈 Dashboard de métricas de leads
- ✉️ Integração com envio de e-mails automáticos
- 🧪 Testes automatizados com Jest

---


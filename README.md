# SaaS de Agendamento - Backend

Sistema de agendamento online para barbearias e clínicas de estética desenvolvido com Node.js, Express e Clean Architecture.

## 🏗️ Arquitetura

Este projeto segue os princípios da **Clean Architecture** e **SOLID**, organizando o código em camadas bem definidas:

- **Domain**: Entidades, Value Objects, Interfaces de Repositório
- **Application**: Use Cases, DTOs
- **Infrastructure**: Implementações de Repositório, Services Externos
- **Presentation**: Controllers, Routes, Middlewares

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL**
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **Nodemailer** para emails
- **Express Validator** para validações

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente (copie `.env.example` para `.env`)
4. Execute as migrações do banco: `npm run prisma:migrate`
5. Inicie o servidor: `npm run dev`

## 📚 Endpoints Principais

### Usuários
- `POST /api/users/register` - Cadastro de usuário
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Perfil do usuário (autenticado)

### Agendamentos
- `POST /api/appointments` - Criar agendamento
- `GET /api/appointments` - Listar agendamentos

## 🧪 Scripts Disponíveis

- `npm run dev` - Modo desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Iniciar servidor de produção
- `npm run test` - Executar testes
- `npm run prisma:studio` - Interface visual do banco

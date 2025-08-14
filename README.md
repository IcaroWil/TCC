# 💈 SaaS Barbearia - Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21+-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0+-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17+-336791.svg)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-3.0-85EA2D.svg)](https://swagger.io/)

Sistema de agendamento online para barbearias desenvolvido com **Arquitetura Hexagonal**, **Clean Architecture** e **SOLID principles**.

## 🎯 **Características Principais**

- ✅ **Arquitetura Hexagonal** (Ports & Adapters)
- ✅ **Clean Architecture** com separação de responsabilidades
- ✅ **SOLID Principles** aplicados rigorosamente
- ✅ **Domain-Driven Design** com entidades e value objects
- ✅ **Documentação Swagger** interativa completa
- ✅ **Autenticação JWT** segura
- ✅ **Validações robustas** com Value Objects
- ✅ **TypeScript** com tipagem estrita
- ✅ **Docker** para desenvolvimento
- ✅ **Testes** unitários e de integração

## 🏗️ **Arquitetura Hexagonal**

```
src/
├── 🎯 domain/              # Camada de Domínio
│   ├── entities/           # Entidades de negócio (User, Appointment, Service, Establishment)
│   ├── value-objects/      # Objetos de valor (Email, Phone, DateTime)
│   ├── repositories/       # Interfaces dos repositórios (Ports)
│   └── services/           # Interfaces dos serviços
├── 🔄 application/         # Camada de Aplicação
│   ├── use-cases/          # Casos de uso (regras de negócio)
│   ├── dtos/              # Objetos de transferência de dados
│   └── validators/         # Validações de entrada (express-validator)
├── 🔧 infrastructure/      # Camada de Infraestrutura
│   ├── database/          # Implementações Prisma (Adapters)
│   ├── external-services/ # Serviços externos (JWT, Email)
│   ├── config/            # Configurações de ambiente
│   └── docs/              # Documentação Swagger
├── 🎨 presentation/        # Camada de Apresentação
│   ├── controllers/       # Controladores HTTP
│   ├── routes/            # Rotas da API
│   └── middlewares/       # Middlewares (Auth, Error, Admin, Swagger)
├── 🚀 main/               # Camada Principal
│   ├── factories/         # Injeção de dependências
│   └── server.ts          # Servidor Express
└── 🔗 shared/             # Recursos Compartilhados
    └── errors/            # Classes de erro customizadas
```

### **🔄 Fluxo da Arquitetura**
```
HTTP Request → Presentation → Application → Domain → Infrastructure
     ↓              ↓            ↓         ↓           ↓
  Routes      Controllers   Use Cases  Entities   Repositories
     ↓              ↓            ↓         ↓           ↓
Middlewares    Validation   Business   Value      Database
                            Rules     Objects
```

## 🚀 **Tecnologias & Stack**

### **Core**
- **Node.js 18+** - Runtime JavaScript
- **TypeScript 5.8+** - Tipagem estática
- **Express.js 4.21+** - Framework web

### **Banco de Dados**
- **PostgreSQL 17** - Banco relacional
- **Prisma ORM 5.0+** - ORM type-safe
- **Docker Compose** - Containerização

### **Segurança & Autenticação**
- **JWT** - JSON Web Tokens
- **bcryptjs** - Hash de senhas
- **Helmet** - Proteção de headers
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - Limitação de requisições

### **Documentação & Validação**
- **Swagger/OpenAPI 3.0** - Documentação interativa
- **Express Validator** - Validação de dados
- **Value Objects** - Validações de domínio

### **Desenvolvimento**
- **ts-node-dev** - Hot reload
- **Nodemailer** - Envio de emails
- **UUID** - Identificadores únicos

## 📦 **Instalação & Configuração**

### **1. Pré-requisitos**
```bash
# Node.js 18+
node --version

# Docker & Docker Compose
docker --version
docker-compose --version
```

### **2. Clone & Instalação**
```bash
# Clone o repositório
git clone <repository-url>
cd backend

# Instale as dependências
npm install
```

### **3. Configuração do Ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure as variáveis (veja seção abaixo)
nano .env
```

### **4. Banco de Dados**
```bash
# Inicie o PostgreSQL com Docker
docker-compose up -d

# Sincronize o schema do Prisma
npx prisma db push

# (Opcional) Visualize os dados
npx prisma studio
```

### **5. Iniciar Aplicação**
```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## ⚙️ **Variáveis de Ambiente**

```env
# 🚀 Servidor
PORT=3000
NODE_ENV=development

# 🗄️ Banco de Dados
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/barbearia"

# 🔐 JWT
JWT_SECRET="seu-jwt-secret-super-seguro-aqui"
JWT_EXPIRES_IN="24h"

# 📧 Email (Opcional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"

# 🌐 Frontend (CORS)
FRONTEND_URL="http://localhost:3000"
```

## 📚 **Documentação da API**

### **🎨 Swagger UI Interativo**
```
http://localhost:3000/docs
```

### **📋 Endpoints Disponíveis**

#### **👤 Usuários - ✅ 100% Funcionais**
| Método | Endpoint | Descrição | Auth | Permissão | Status |
|--------|----------|-----------|------|-----------|--------|
| `POST` | `/api/users/register` | Criar usuário | 🔓 | Público | ✅ |
| `POST` | `/api/users/login` | Autenticar usuário | 🔓 | Público | ✅ |
| `GET` | `/api/users/profile` | Obter perfil | 🔒 | Autenticado | ✅ |
| `GET` | `/api/users` | Listar usuários | 🔒 | ADMIN | ✅ |
| `GET` | `/api/users/:id` | Obter usuário por ID | 🔒 | ADMIN | ✅ |
| `PUT` | `/api/users/:id` | Atualizar usuário | 🔒 | ADMIN | ✅ |
| `DELETE` | `/api/users/:id` | Deletar usuário | 🔒 | ADMIN | ✅ |

#### **📅 Agendamentos - ✅ 100% Funcionais**
| Método | Endpoint | Descrição | Auth | Permissão | Status |
|--------|----------|-----------|------|-----------|--------|
| `POST` | `/api/appointments` | Criar agendamento | 🔒 | Autenticado | ✅ |
| `GET` | `/api/appointments` | Listar agendamentos | 🔒 | Autenticado | ✅ |
| `GET` | `/api/appointments/:id` | Obter agendamento por ID | 🔒 | Autenticado | ✅ |
| `PUT` | `/api/appointments/:id` | Atualizar agendamento | 🔒 | Autenticado | ✅ |
| `DELETE` | `/api/appointments/:id` | Deletar agendamento | 🔒 | Autenticado | ✅ |

#### **💼 Serviços - ✅ 100% Funcionais**
| Método | Endpoint | Descrição | Auth | Permissão | Status |
|--------|----------|-----------|------|-----------|--------|
| `POST` | `/api/services` | Criar serviço | 🔒 | ADMIN | ✅ |
| `GET` | `/api/services` | Listar serviços | 🔒 | Autenticado | ✅ |
| `GET` | `/api/services/:id` | Obter serviço por ID | 🔒 | Autenticado | ✅ |
| `PUT` | `/api/services/:id` | Atualizar serviço | 🔒 | ADMIN | ✅ |
| `DELETE` | `/api/services/:id` | Deletar serviço | 🔒 | ADMIN | ✅ |

#### **🏪 Estabelecimentos - ✅ 100% Funcionais**
| Método | Endpoint | Descrição | Auth | Permissão | Status |
|--------|----------|-----------|------|-----------|--------|
| `POST` | `/api/establishments` | Criar estabelecimento | 🔒 | ADMIN | ✅ |
| `GET` | `/api/establishments` | Listar estabelecimentos | 🔒 | Autenticado | ✅ |
| `GET` | `/api/establishments/:id` | Obter estabelecimento por ID | 🔒 | Autenticado | ✅ |
| `PUT` | `/api/establishments/:id` | Atualizar estabelecimento | 🔒 | ADMIN | ✅ |
| `DELETE` | `/api/establishments/:id` | Deletar estabelecimento | 🔒 | ADMIN | ✅ |

#### **🏥 Sistema - ✅ Funcionando**
| Método | Endpoint | Descrição | Auth | Permissão | Status |
|--------|----------|-----------|------|-----------|--------|
| `GET` | `/health` | Health check | 🔓 | Público | ✅ |

### **🔐 Autenticação JWT**

1. **Registre um usuário** em `/api/users/register`
2. **Faça login** em `/api/users/login`
3. **Use o token** nos headers: `Authorization: Bearer <token>`

## 🧪 **Scripts Disponíveis**

```bash
# 🚀 Desenvolvimento
npm run dev              # Inicia servidor com hot reload

# 🏗️ Build & Produção
npm run build           # Compila TypeScript
npm start              # Inicia servidor de produção

# 🗄️ Banco de Dados
npx prisma studio      # Interface visual do banco
npx prisma db push     # Sincroniza schema
npx prisma generate    # Gera cliente Prisma

# 🐳 Docker
docker-compose up -d   # Inicia PostgreSQL
docker-compose down    # Para containers
```

## 🎯 **Casos de Uso Implementados**

### **👤 Gestão de Usuários**
- ✅ **CreateUserUseCase** - Criar usuário com validações
- ✅ **AuthenticateUserUseCase** - Autenticar e gerar JWT
- ✅ **ListUsersUseCase** - Listar usuários (ADMIN)
- ✅ **GetUserByIdUseCase** - Obter usuário por ID (ADMIN)
- ✅ **UpdateUserUseCase** - Atualizar usuário (ADMIN)
- ✅ **DeleteUserUseCase** - Deletar usuário (ADMIN)

### **📅 Gestão de Agendamentos**
- ✅ **CreateAppointmentUseCase** - Criar agendamento com validações
- ✅ **ListAppointmentsUseCase** - Listar com filtros avançados
- ✅ **GetAppointmentByIdUseCase** - Obter agendamento por ID
- ✅ **UpdateAppointmentUseCase** - Atualizar agendamento
- ✅ **DeleteAppointmentUseCase** - Deletar agendamento

### **💼 Gestão de Serviços**
- ✅ **CreateServiceUseCase** - Criar serviço (ADMIN)
- ✅ **ListServicesUseCase** - Listar serviços
- ✅ **GetServiceByIdUseCase** - Obter serviço por ID
- ✅ **UpdateServiceUseCase** - Atualizar serviço (ADMIN)
- ✅ **DeleteServiceUseCase** - Deletar serviço (ADMIN)

### **🏪 Gestão de Estabelecimentos**
- ✅ **CreateEstablishmentUseCase** - Criar estabelecimento (ADMIN)
- ✅ **ListEstablishmentsUseCase** - Listar estabelecimentos
- ✅ **GetEstablishmentByIdUseCase** - Obter estabelecimento por ID
- ✅ **UpdateEstablishmentUseCase** - Atualizar estabelecimento (ADMIN)
- ✅ **DeleteEstablishmentUseCase** - Deletar estabelecimento (ADMIN)

### **🛡️ Validações de Domínio**
- ✅ **Email Value Object** - Validação de formato
- ✅ **Phone Value Object** - Telefone brasileiro
- ✅ **DateTime Value Object** - Regras de data/hora

### **🔐 Segurança & Autorização**
- ✅ **JWT Authentication** - Autenticação baseada em tokens
- ✅ **Role-based Authorization** - Controle de acesso por roles (CLIENT, EMPLOYEE, ADMIN)
- ✅ **Admin Middleware** - Proteção de endpoints administrativos
- ✅ **Password Hashing** - Hash seguro de senhas com bcrypt

## 🧪 **Testando a API**

### **1. Com Swagger UI (Recomendado)**
```
http://localhost:3000/docs
```

### **2. Com cURL**
```bash
# Health check
curl http://localhost:3000/health

# Criar usuário
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456",
    "name": "João Silva",
    "phone": "(11) 99999-9999",
    "role": "CLIENT"
  }'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### **3. Com Insomnia/Postman**
- Importe a collection do Swagger
- Configure ambiente com URL base
- Use JWT nos headers de autorização

## 🏆 **Princípios Aplicados**

### **🎯 SOLID Principles**
- **S**ingle Responsibility - Cada classe tem uma responsabilidade
- **O**pen/Closed - Aberto para extensão, fechado para modificação
- **L**iskov Substitution - Substituição de interfaces
- **I**nterface Segregation - Interfaces específicas
- **D**ependency Inversion - Inversão de dependências

### **🏗️ Clean Architecture**
- **Independência de frameworks**
- **Testabilidade**
- **Independência de UI**
- **Independência de banco de dados**
- **Independência de agentes externos**

### **🔄 Domain-Driven Design**
- **Entidades** com regras de negócio
- **Value Objects** para validações
- **Repositórios** como contratos
- **Use Cases** para orquestração

## ✅ **Funcionalidades Implementadas**

### **🎯 Core Features - 100% Funcionais**
- [x] **CRUD Completo de Usuários** - Criar, listar, buscar, atualizar, deletar ✅
- [x] **CRUD Completo de Agendamentos** - Todas operações funcionando ✅
- [x] **CRUD Completo de Serviços** - Gerenciamento completo ✅
- [x] **CRUD Completo de Estabelecimentos** - Todas operações ✅
- [x] **Autenticação JWT** - Login e registro funcionando ✅
- [x] **Autorização por Roles** - ADMIN, EMPLOYEE, CLIENT ✅
- [x] **Documentação Swagger** - Interface profissional com tema escuro ✅
- [x] **Validações Robustas** - Value Objects e express-validator ✅
- [x] **Arquitetura Hexagonal** - Clean Architecture implementada ✅

### **🧪 Testes Validados - 100% Passando**
- [x] **test-crud-users.sh** - Todos os endpoints de usuários ✅
- [x] **test-crud-appointments.sh** - Todos os endpoints de agendamentos ✅
- [x] **test-crud-services.sh** - Todos os endpoints de serviços ✅
- [x] **test-crud-establishments.sh** - Todos os endpoints de estabelecimentos ✅
- [x] **Health Check** - Endpoint de saúde funcionando ✅

## 🚀 **Próximas Funcionalidades**

- [ ] **Tratamento de Erros** - Sistema padronizado de logs
- [ ] **Notificações** - Email/SMS automáticos
- [ ] **Sistema de Pagamentos** - Integração PIX/Cartão
- [ ] **Relatórios** - Dashboard analítico
- [ ] **API de Disponibilidade** - Horários livres
- [ ] **Integração Calendários** - Google/Outlook
- [ ] **Testes Automatizados** - Jest/Supertest
- [ ] **CI/CD Pipeline** - GitHub Actions
- [ ] **Monitoramento** - Logs e métricas
- [ ] **Multi-tenancy** - Suporte a múltiplas barbearias
- [ ] **Cache Redis** - Otimização de performance
- [ ] **Rate Limiting** - Proteção contra spam

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Add nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**🎯 Desenvolvido com Arquitetura Hexagonal, Clean Code e muito ☕**

**📚 Documentação completa disponível em: http://localhost:3000/docs**

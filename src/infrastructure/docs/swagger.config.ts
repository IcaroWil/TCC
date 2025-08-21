import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../config/environment';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SaaS Barbearia API',
      version: '1.0.0',
      description: `
        API completa para sistema de agendamento de barbearia seguindo arquitetura hexagonal.
        
        ## Arquitetura
        - **Domain Layer**: Entidades de negócio e regras de domínio
        - **Application Layer**: Casos de uso e DTOs
        - **Infrastructure Layer**: Repositórios e serviços externos
        - **Presentation Layer**: Controllers e rotas
        
        ## Autenticação
        Esta API utiliza JWT (JSON Web Tokens) para autenticação.
        Para acessar endpoints protegidos, inclua o token no header:
        \`Authorization: Bearer <seu-token>\`
      `,
      contact: {
        name: 'SaaS Barbearia',
        email: 'contato@saasbarbearia.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.saasbarbearia.com',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido através do endpoint de login'
        }
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'Endpoints de verificação de saúde do sistema'
      },
      {
        name: 'Admin',
        description: 'Endpoints exclusivos para administradores - CRUD completo de estabelecimentos, serviços e funcionários'
      },
      {
        name: 'Employee',
        description: 'Endpoints para funcionários - Acesso somente leitura aos dados do estabelecimento'
      },
      {
        name: 'Client',
        description: 'Endpoints para clientes - Visualizar estabelecimentos, serviços e gerenciar agendamentos'
      },
      {
        name: 'Auth',
        description: 'Autenticação e autorização - Login, registro e gerenciamento de tokens'
      }
    ]
  },
  apis: [
    './src/presentation/routes/**/*.ts',
    './src/infrastructure/docs/schemas/*.ts',
    './src/infrastructure/docs/paths/*.ts'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
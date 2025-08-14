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
      responses: {
        UnauthorizedError: {
          description: 'Token de acesso ausente ou inválido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'string',
                    example: 'Token não fornecido'
                  }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Erro de validação dos dados enviados',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        field: {
                          type: 'string',
                          example: 'email'
                        },
                        message: {
                          type: 'string',
                          example: 'Email deve ter um formato válido'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        InternalServerError: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false
                  },
                  error: {
                    type: 'string',
                    example: 'Internal server error'
                  }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Health',
        description: 'Endpoints de verificação de saúde do sistema'
      },
      {
        name: 'Users',
        description: 'Gerenciamento de usuários (clientes, funcionários, administradores)'
      },
      {
        name: 'Appointments',
        description: 'Gerenciamento de agendamentos'
      },
      {
        name: 'Services',
        description: 'Gerenciamento de serviços oferecidos'
      },
      {
        name: 'Establishments',
        description: 'Gerenciamento de estabelecimentos (barbearias)'
      }
    ]
  },
  apis: [
    './src/presentation/routes/*.ts',
    './src/infrastructure/docs/schemas/*.ts',
    './src/infrastructure/docs/paths/*.ts'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
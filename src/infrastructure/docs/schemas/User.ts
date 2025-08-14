/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       description: Entidade de usuário do domínio (Cliente, Funcionário ou Administrador)
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identificador único do usuário
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário (deve ser único)
 *           example: "joao@email.com"
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *           example: "João Silva"
 *         phone:
 *           type: string
 *           description: Telefone brasileiro no formato (XX) XXXXX-XXXX
 *           example: "(11) 99999-9999"
 *         role:
 *           type: string
 *           enum: [CLIENT, EMPLOYEE, ADMIN]
 *           description: Papel do usuário no sistema
 *           example: "CLIENT"
 *         establishmentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID do estabelecimento (obrigatório para EMPLOYEE e ADMIN)
 *           example: "456e7890-e89b-12d3-a456-426614174001"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do usuário
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2024-01-15T10:30:00Z"
 *       required:
 *         - id
 *         - email
 *         - name
 *         - phone
 *         - role
 *         - createdAt
 *         - updatedAt
 * 
 *     CreateUserRequest:
 *       type: object
 *       description: DTO para criação de usuário
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email único do usuário
 *           example: "joao@email.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Senha do usuário (mínimo 6 caracteres)
 *           example: "123456"
 *         name:
 *           type: string
 *           minLength: 2
 *           description: Nome completo do usuário
 *           example: "João Silva"
 *         phone:
 *           type: string
 *           pattern: '^\(\d{2}\) \d{4,5}-\d{4}$'
 *           description: Telefone brasileiro no formato (XX) XXXXX-XXXX
 *           example: "(11) 99999-9999"
 *         role:
 *           type: string
 *           enum: [CLIENT, EMPLOYEE, ADMIN]
 *           description: Papel do usuário no sistema
 *           example: "CLIENT"
 *         establishmentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID do estabelecimento (obrigatório para EMPLOYEE e ADMIN)
 *           example: "456e7890-e89b-12d3-a456-426614174001"
 *       required:
 *         - email
 *         - password
 *         - name
 *         - phone
 *         - role
 * 
 *     LoginRequest:
 *       type: object
 *       description: DTO para autenticação de usuário
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: "joao@email.com"
 *         password:
 *           type: string
 *           description: Senha do usuário
 *           example: "123456"
 *       required:
 *         - email
 *         - password
 * 
 *     UserResponse:
 *       type: object
 *       description: Resposta padrão com dados do usuário
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/UserData'
 * 
 *     UserData:
 *       type: object
 *       description: Dados do usuário retornados pela API (sem senha)
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         email:
 *           type: string
 *           format: email
 *           example: "joao@email.com"
 *         name:
 *           type: string
 *           example: "João Silva"
 *         phone:
 *           type: string
 *           example: "(11) 99999-9999"
 *         role:
 *           type: string
 *           enum: [CLIENT, EMPLOYEE, ADMIN]
 *           example: "CLIENT"
 *         establishmentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "456e7890-e89b-12d3-a456-426614174001"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 * 
 *     AuthResponse:
 *       type: object
 *       description: Resposta de autenticação com token JWT
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/UserData'
 *             token:
 *               type: string
 *               description: Token JWT para autenticação
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
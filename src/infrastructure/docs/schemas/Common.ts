/**
 * @swagger
 * components:
 *   schemas:
 *     SuccessResponse:
 *       type: object
 *       description: Resposta padrão de sucesso
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           description: Dados específicos da resposta
 * 
 *     ErrorResponse:
 *       type: object
 *       description: Resposta padrão de erro
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           description: Mensagem de erro
 *           example: "Recurso não encontrado"
 * 
 *     ValidationErrorResponse:
 *       type: object
 *       description: Resposta de erro de validação
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 description: Campo que falhou na validação
 *                 example: "email"
 *               message:
 *                 type: string
 *                 description: Mensagem de erro específica
 *                 example: "Email deve ter um formato válido"
 *               value:
 *                 type: string
 *                 description: Valor que foi enviado
 *                 example: "email-invalido"
 * 
 *     HealthResponse:
 *       type: object
 *       description: Resposta do health check
 *       properties:
 *         status:
 *           type: string
 *           example: "OK"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *         uptime:
 *           type: number
 *           description: Tempo de atividade do servidor em segundos
 *           example: 3600.5
 * 
 *     PaginationQuery:
 *       type: object
 *       description: Parâmetros de paginação
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           description: Número da página (começa em 1)
 *           example: 1
 *           default: 1
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           description: Quantidade de itens por página
 *           example: 10
 *           default: 10
 * 
 *     PaginatedResponse:
 *       type: object
 *       description: Resposta paginada genérica
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               description: Lista de itens da página atual
 *             total:
 *               type: integer
 *               description: Total de itens disponíveis
 *               example: 150
 *             page:
 *               type: integer
 *               description: Página atual
 *               example: 1
 *             limit:
 *               type: integer
 *               description: Limite de itens por página
 *               example: 10
 *             totalPages:
 *               type: integer
 *               description: Total de páginas disponíveis
 *               example: 15
 * 
 *     UUID:
 *       type: string
 *       format: uuid
 *       description: Identificador único universal
 *       example: "123e4567-e89b-12d3-a456-426614174000"
 * 
 *     DateTime:
 *       type: string
 *       format: date-time
 *       description: Data e hora no formato ISO 8601
 *       example: "2024-01-15T10:30:00Z"
 * 
 *     BrazilianPhone:
 *       type: string
 *       pattern: '^\(\d{2}\) \d{4,5}-\d{4}$'
 *       description: Telefone brasileiro no formato (XX) XXXXX-XXXX
 *       example: "(11) 99999-9999"
 * 
 *     Email:
 *       type: string
 *       format: email
 *       description: Endereço de email válido
 *       example: "usuario@email.com"
 * 
 *     UserRole:
 *       type: string
 *       enum: [CLIENT, EMPLOYEE, ADMIN]
 *       description: |
 *         Papéis de usuário no sistema:
 *         - CLIENT: Cliente que agenda serviços
 *         - EMPLOYEE: Funcionário que realiza serviços
 *         - ADMIN: Administrador do estabelecimento
 *       example: "CLIENT"
 */
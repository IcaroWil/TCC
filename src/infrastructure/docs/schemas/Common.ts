/**
 * @swagger
 * components:
 *   schemas:
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
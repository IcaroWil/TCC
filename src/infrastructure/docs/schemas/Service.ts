/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       description: Entidade de serviço do domínio
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identificador único do serviço
 *           example: "456e7890-e89b-12d3-a456-426614174001"
 *         name:
 *           type: string
 *           description: Nome do serviço
 *           example: "Corte Masculino"
 *         description:
 *           type: string
 *           description: Descrição detalhada do serviço
 *           example: "Corte de cabelo masculino com acabamento à máquina"
 *         duration:
 *           type: integer
 *           description: Duração do serviço em minutos
 *           example: 30
 *         price:
 *           type: number
 *           format: decimal
 *           description: Preço do serviço em reais
 *           example: 25.00
 *         establishmentId:
 *           type: string
 *           format: uuid
 *           description: ID do estabelecimento que oferece o serviço
 *           example: "789e1234-e89b-12d3-a456-426614174003"
 *         isActive:
 *           type: boolean
 *           description: Indica se o serviço está ativo/disponível
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do serviço
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2024-01-15T10:30:00Z"
 *       required:
 *         - id
 *         - name
 *         - description
 *         - duration
 *         - price
 *         - establishmentId
 *         - isActive
 *         - createdAt
 *         - updatedAt
 * 
 *     CreateServiceRequest:
 *       type: object
 *       description: DTO para criação de serviço
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           description: Nome do serviço
 *           example: "Corte Masculino"
 *         description:
 *           type: string
 *           minLength: 10
 *           description: Descrição detalhada do serviço
 *           example: "Corte de cabelo masculino com acabamento à máquina"
 *         duration:
 *           type: integer
 *           minimum: 15
 *           maximum: 480
 *           description: Duração em minutos (15 min a 8 horas)
 *           example: 30
 *         price:
 *           type: number
 *           format: decimal
 *           minimum: 0.01
 *           description: Preço do serviço em reais
 *           example: 25.00
 *         establishmentId:
 *           type: string
 *           format: uuid
 *           description: ID do estabelecimento
 *           example: "789e1234-e89b-12d3-a456-426614174003"
 *         isActive:
 *           type: boolean
 *           description: "Se o serviço está ativo (padrão: true)"
 *           example: true
 *           default: true
 *       required:
 *         - name
 *         - description
 *         - duration
 *         - price
 *         - establishmentId
 * 
 *     ServiceResponse:
 *       type: object
 *       description: Resposta padrão com dados do serviço
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Service'
 * 
 *     ServiceListResponse:
 *       type: object
 *       description: Resposta com lista de serviços
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Service'
 */
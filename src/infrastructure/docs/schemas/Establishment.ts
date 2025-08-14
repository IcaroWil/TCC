/**
 * @swagger
 * components:
 *   schemas:
 *     Establishment:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - phone
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único do estabelecimento
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           description: Nome do estabelecimento
 *           example: "Barbearia do João"
 *         address:
 *           type: string
 *           description: Endereço completo
 *           example: "Rua das Flores, 123 - Centro"
 *         phone:
 *           type: string
 *           description: Telefone de contato
 *           example: "(11) 99999-9999"
 *         email:
 *           type: string
 *           format: email
 *           description: Email de contato
 *           example: "contato@barbearia.com"
 *         description:
 *           type: string
 *           description: Descrição do estabelecimento
 *           example: "Barbearia tradicional com mais de 20 anos de experiência"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: "2024-01-15T10:30:00Z"
 *     
 *     CreateEstablishmentRequest:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - phone
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do estabelecimento
 *           example: "Barbearia do João"
 *         address:
 *           type: string
 *           description: Endereço completo
 *           example: "Rua das Flores, 123 - Centro"
 *         phone:
 *           type: string
 *           description: Telefone de contato
 *           example: "(11) 99999-9999"
 *         email:
 *           type: string
 *           format: email
 *           description: Email de contato
 *           example: "contato@barbearia.com"
 *         description:
 *           type: string
 *           description: Descrição do estabelecimento
 *           example: "Barbearia tradicional com mais de 20 anos de experiência"
 *     
 *     UpdateEstablishmentRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do estabelecimento
 *           example: "Barbearia do João - Filial Centro"
 *         address:
 *           type: string
 *           description: Endereço completo
 *           example: "Rua das Flores, 123 - Centro"
 *         phone:
 *           type: string
 *           description: Telefone de contato
 *           example: "(11) 99999-9999"
 *         email:
 *           type: string
 *           format: email
 *           description: Email de contato
 *           example: "contato@barbearia.com"
 *         description:
 *           type: string
 *           description: Descrição do estabelecimento
 *           example: "Barbearia tradicional com mais de 20 anos de experiência"
 */
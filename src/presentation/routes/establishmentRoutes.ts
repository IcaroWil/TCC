import { Router, Request, Response, NextFunction } from 'express';
import { EstablishmentController } from '../controllers/EstablishmentController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { AdminMiddleware } from '../middlewares/adminMiddleware';
import { validateEstablishmentCreation, validateEstablishmentUpdate } from '../middlewares/validationMiddleware';

export function createEstablishmentRoutes(
    establishmentController: EstablishmentController,
    authMiddleware: AuthMiddleware
): Router {
    const router = Router();

    /**
     * @swagger
     * components:
     *   schemas:
     *     Establishment:
     *       type: object
     *       required:
     *         - name
     *         - email
     *         - phone
     *         - address
     *         - city
     *         - state
     *         - zipCode
     *         - cnpj
     *       properties:
     *         id:
     *           type: string
     *           format: uuid
     *           description: ID único do estabelecimento
     *         name:
     *           type: string
     *           minLength: 2
     *           maxLength: 100
     *           description: Nome do estabelecimento
     *         email:
     *           type: string
     *           format: email
     *           description: Email do estabelecimento
     *         phone:
     *           type: string
     *           pattern: '^\(\d{2}\)\s\d{4,5}-\d{4}$'
     *           description: Telefone no formato (XX) XXXXX-XXXX
     *         address:
     *           type: string
     *           minLength: 10
     *           maxLength: 200
     *           description: Endereço completo
     *         city:
     *           type: string
     *           minLength: 2
     *           maxLength: 100
     *           description: Cidade
     *         state:
     *           type: string
     *           minLength: 2
     *           maxLength: 2
     *           description: Estado (sigla)
     *         zipCode:
     *           type: string
     *           pattern: '^\d{5}-?\d{3}$'
     *           description: CEP no formato XXXXX-XXX
     *         cnpj:
     *           type: string
     *           pattern: '^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$'
     *           description: CNPJ no formato XX.XXX.XXX/XXXX-XX
     *         isActive:
     *           type: boolean
     *           description: Status ativo do estabelecimento
     *         createdAt:
     *           type: string
     *           format: date-time
     *           description: Data de criação
     *         updatedAt:
     *           type: string
     *           format: date-time
     *           description: Data da última atualização
     *       example:
     *         id: "550e8400-e29b-41d4-a716-446655440000"
     *         name: "Barbearia Central"
     *         email: "contato@barbeariacentral.com"
     *         phone: "(11) 99999-9999"
     *         address: "Rua das Flores, 123, Centro"
     *         city: "São Paulo"
     *         state: "SP"
     *         zipCode: "01234-567"
     *         cnpj: "12.345.678/0001-90"
     *         isActive: true
     *         createdAt: "2024-01-15T10:00:00Z"
     *         updatedAt: "2024-01-15T10:00:00Z"
     *
     *     CreateEstablishmentRequest:
     *       type: object
     *       required:
     *         - name
     *         - email
     *         - phone
     *         - address
     *         - city
     *         - state
     *         - zipCode
     *         - cnpj
     *       properties:
     *         name:
     *           type: string
     *           minLength: 2
     *           maxLength: 100
     *         email:
     *           type: string
     *           format: email
     *         phone:
     *           type: string
     *           pattern: '^\(\d{2}\)\s\d{4,5}-\d{4}$'
     *         address:
     *           type: string
     *           minLength: 10
     *           maxLength: 200
     *         city:
     *           type: string
     *           minLength: 2
     *           maxLength: 100
     *         state:
     *           type: string
     *           minLength: 2
     *           maxLength: 2
     *         zipCode:
     *           type: string
     *           pattern: '^\d{5}-?\d{3}$'
     *         cnpj:
     *           type: string
     *           pattern: '^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$'
     *       example:
     *         name: "Barbearia Central"
     *         email: "contato@barbeariacentral.com"
     *         phone: "(11) 99999-9999"
     *         address: "Rua das Flores, 123, Centro"
     *         city: "São Paulo"
     *         state: "SP"
     *         zipCode: "01234-567"
     *         cnpj: "12.345.678/0001-90"
     *
     *     UpdateEstablishmentRequest:
     *       type: object
     *       properties:
     *         name:
     *           type: string
     *           minLength: 2
     *           maxLength: 100
     *         email:
     *           type: string
     *           format: email
     *         phone:
     *           type: string
     *           pattern: '^\(\d{2}\)\s\d{4,5}-\d{4}$'
     *         address:
     *           type: string
     *           minLength: 10
     *           maxLength: 200
     *         city:
     *           type: string
     *           minLength: 2
     *           maxLength: 100
     *         state:
     *           type: string
     *           minLength: 2
     *           maxLength: 2
     *         zipCode:
     *           type: string
     *           pattern: '^\d{5}-?\d{3}$'
     *         cnpj:
     *           type: string
     *           pattern: '^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$'
     *         isActive:
     *           type: boolean
     *       example:
     *         name: "Barbearia Central Premium"
     *         phone: "(11) 88888-8888"
     *         isActive: true
     */

    /**
     * @swagger
     * /api/establishments:
     *   post:
     *     summary: Criar novo estabelecimento
     *     description: Cria um novo estabelecimento no sistema (apenas ADMIN)
     *     tags: [Establishments]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateEstablishmentRequest'
     *     responses:
     *       201:
     *         description: Estabelecimento criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: "Establishment created successfully"
     *                 data:
     *                   $ref: '#/components/schemas/Establishment'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Token não fornecido ou inválido
     *       403:
     *         description: Acesso negado
     *       409:
     *         description: Estabelecimento já existe
     */
    router.post('/',
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        AdminMiddleware.requireAdmin,
        validateEstablishmentCreation,
        (req: Request, res: Response) => establishmentController.create(req, res)
    );

    /**
     * @swagger
     * /api/establishments:
     *   get:
     *     summary: Listar estabelecimentos
     *     description: Lista estabelecimentos com paginação e filtros opcionais
     *     tags: [Establishments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         description: Número da página
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 100
     *           default: 10
     *         description: Itens por página
     *       - in: query
     *         name: activeOnly
     *         schema:
     *           type: boolean
     *           default: false
     *         description: Mostrar apenas estabelecimentos ativos
     *     responses:
     *       200:
     *         description: Lista de estabelecimentos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: object
     *                   properties:
     *                     establishments:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Establishment'
     *                     pagination:
     *                       type: object
     *                       properties:
     *                         page:
     *                           type: integer
     *                         limit:
     *                           type: integer
     *                         total:
     *                           type: integer
     *                         totalPages:
     *                           type: integer
     *       401:
     *         description: Token não fornecido ou inválido
     */
    router.get('/', 
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        (req: Request, res: Response) => establishmentController.list(req, res)
    );

    /**
     * @swagger
     * /api/establishments/{id}:
     *   get:
     *     summary: Buscar estabelecimento por ID
     *     description: Retorna um estabelecimento específico pelo ID
     *     tags: [Establishments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: ID do estabelecimento
     *     responses:
     *       200:
     *         description: Estabelecimento encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/Establishment'
     *       401:
     *         description: Token não fornecido ou inválido
     *       404:
     *         description: Estabelecimento não encontrado
     */
    router.get('/:id', 
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        (req: Request, res: Response) => establishmentController.getById(req, res)
    );

    /**
     * @swagger
     * /api/establishments/{id}:
     *   put:
     *     summary: Atualizar estabelecimento
     *     description: Atualiza um estabelecimento existente (apenas ADMIN)
     *     tags: [Establishments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: ID do estabelecimento
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateEstablishmentRequest'
     *     responses:
     *       200:
     *         description: Estabelecimento atualizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: "Establishment updated successfully"
     *                 data:
     *                   $ref: '#/components/schemas/Establishment'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Token não fornecido ou inválido
     *       403:
     *         description: Acesso negado
     *       404:
     *         description: Estabelecimento não encontrado
     *       409:
     *         description: Conflito de dados
     */
    router.put('/:id',
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        AdminMiddleware.requireAdmin,
        validateEstablishmentUpdate,
        (req: Request, res: Response) => establishmentController.update(req, res)
    );

    /**
     * @swagger
     * /api/establishments/{id}:
     *   delete:
     *     summary: Deletar estabelecimento
     *     description: Remove um estabelecimento do sistema (apenas ADMIN)
     *     tags: [Establishments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: ID do estabelecimento
     *     responses:
     *       204:
     *         description: Estabelecimento deletado com sucesso
     *       401:
     *         description: Token não fornecido ou inválido
     *       403:
     *         description: Acesso negado
     *       404:
     *         description: Estabelecimento não encontrado
     *       409:
     *         description: Não é possível deletar - estabelecimento tem dados associados
     */
    router.delete('/:id',
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        AdminMiddleware.requireAdmin,
        (req: Request, res: Response) => establishmentController.delete(req, res)
    );

    return router;
}
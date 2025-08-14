import { Router, Request, Response, NextFunction } from 'express';
import { ServiceController } from '../controllers/ServiceController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { validateServiceCreation, validateServiceUpdate } from '../middlewares/validationMiddleware';

export function createServiceRoutes(
    serviceController: ServiceController,
    authMiddleware: AuthMiddleware
): Router {
    const router = Router();

    /**
     * @swagger
     * components:
     *   schemas:
     *     Service:
     *       type: object
     *       required:
     *         - name
     *         - description
     *         - duration
     *         - price
     *         - establishmentId
     *       properties:
     *         id:
     *           type: string
     *           format: uuid
     *           description: ID único do serviço
     *         name:
     *           type: string
     *           minLength: 2
     *           maxLength: 100
     *           description: Nome do serviço
     *         description:
     *           type: string
     *           maxLength: 500
     *           description: Descrição do serviço
     *         duration:
     *           type: integer
     *           minimum: 15
     *           maximum: 480
     *           description: Duração do serviço em minutos
     *         price:
     *           type: number
     *           minimum: 0.01
     *           description: Preço do serviço
     *         establishmentId:
     *           type: string
     *           format: uuid
     *           description: ID do estabelecimento
     *         isActive:
     *           type: boolean
     *           description: Status ativo do serviço
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
     *         name: "Corte de Cabelo"
     *         description: "Corte masculino tradicional"
     *         duration: 30
     *         price: 25.00
     *         establishmentId: "550e8400-e29b-41d4-a716-446655440001"
     *         isActive: true
     *         createdAt: "2024-01-15T10:00:00Z"
     *         updatedAt: "2024-01-15T10:00:00Z"
     *
     *     CreateServiceRequest:
     *       type: object
     *       required:
     *         - name
     *         - description
     *         - duration
     *         - price
     *         - establishmentId
     *       properties:
     *         name:
     *           type: string
     *           minLength: 2
     *           maxLength: 100
     *         description:
     *           type: string
     *           maxLength: 500
     *         duration:
     *           type: integer
     *           minimum: 15
     *           maximum: 480
     *         price:
     *           type: number
     *           minimum: 0.01
     *         establishmentId:
     *           type: string
     *           format: uuid
     *       example:
     *         name: "Corte de Cabelo"
     *         description: "Corte masculino tradicional"
     *         duration: 30
     *         price: 25.00
     *         establishmentId: "550e8400-e29b-41d4-a716-446655440001"
     *
     *     UpdateServiceRequest:
     *       type: object
     *       properties:
     *         name:
     *           type: string
     *           minLength: 2
     *           maxLength: 100
     *         description:
     *           type: string
     *           maxLength: 500
     *         duration:
     *           type: integer
     *           minimum: 15
     *           maximum: 480
     *         price:
     *           type: number
     *           minimum: 0.01
     *         isActive:
     *           type: boolean
     *       example:
     *         name: "Corte Premium"
     *         price: 35.00
     *         isActive: true
     */

    /**
     * @swagger
     * /api/services:
     *   post:
     *     summary: Criar novo serviço
     *     description: Cria um novo serviço no sistema (apenas ADMIN e EMPLOYEE)
     *     tags: [Services]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateServiceRequest'
     *     responses:
     *       201:
     *         description: Serviço criado com sucesso
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
     *                   example: "Service created successfully"
     *                 data:
     *                   $ref: '#/components/schemas/Service'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Token não fornecido ou inválido
     *       403:
     *         description: Acesso negado
     *       409:
     *         description: Serviço já existe
     */
    router.post('/', 
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        validateServiceCreation, 
        (req: Request, res: Response) => serviceController.create(req, res)
    );

    /**
     * @swagger
     * /api/services:
     *   get:
     *     summary: Listar serviços
     *     description: Lista serviços com paginação e filtros opcionais
     *     tags: [Services]
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
     *         name: establishmentId
     *         schema:
     *           type: string
     *           format: uuid
     *         description: Filtrar por estabelecimento
     *       - in: query
     *         name: activeOnly
     *         schema:
     *           type: boolean
     *           default: false
     *         description: Mostrar apenas serviços ativos
     *     responses:
     *       200:
     *         description: Lista de serviços
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
     *                     services:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Service'
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
        (req: Request, res: Response) => serviceController.list(req, res)
    );

    /**
     * @swagger
     * /api/services/{id}:
     *   get:
     *     summary: Buscar serviço por ID
     *     description: Retorna um serviço específico pelo ID
     *     tags: [Services]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: ID do serviço
     *     responses:
     *       200:
     *         description: Serviço encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/Service'
     *       401:
     *         description: Token não fornecido ou inválido
     *       404:
     *         description: Serviço não encontrado
     */
    router.get('/:id', 
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        (req: Request, res: Response) => serviceController.getById(req, res)
    );

    /**
     * @swagger
     * /api/services/{id}:
     *   put:
     *     summary: Atualizar serviço
     *     description: Atualiza um serviço existente (apenas ADMIN e EMPLOYEE)
     *     tags: [Services]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: ID do serviço
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateServiceRequest'
     *     responses:
     *       200:
     *         description: Serviço atualizado com sucesso
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
     *                   example: "Service updated successfully"
     *                 data:
     *                   $ref: '#/components/schemas/Service'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Token não fornecido ou inválido
     *       403:
     *         description: Acesso negado
     *       404:
     *         description: Serviço não encontrado
     *       409:
     *         description: Conflito de dados
     */
    router.put('/:id', 
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        validateServiceUpdate, 
        (req: Request, res: Response) => serviceController.update(req, res)
    );

    /**
     * @swagger
     * /api/services/{id}:
     *   delete:
     *     summary: Deletar serviço
     *     description: Remove um serviço do sistema (apenas ADMIN)
     *     tags: [Services]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: ID do serviço
     *     responses:
     *       204:
     *         description: Serviço deletado com sucesso
     *       401:
     *         description: Token não fornecido ou inválido
     *       403:
     *         description: Acesso negado
     *       404:
     *         description: Serviço não encontrado
     *       409:
     *         description: Não é possível deletar - serviço tem agendamentos associados
     */
    router.delete('/:id', 
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        (req: Request, res: Response) => serviceController.delete(req, res)
    );

    return router;
}
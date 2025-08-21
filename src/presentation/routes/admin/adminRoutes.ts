import { Router } from 'express';
import { RoleBasedAuthMiddleware } from '../../middlewares/roleBasedAuthMiddleware';
import { AdminEstablishmentController } from '../../controllers/admin/AdminEstablishmentController';
import { AdminServiceController } from '../../controllers/admin/AdminServiceController';
import { AdminEmployeeController } from '../../controllers/admin/AdminEmployeeController';
import { categoryRoutes } from './categoryRoutes';
import { settingsRoutes } from './settingsRoutes';

const adminRouter = Router();

adminRouter.use(RoleBasedAuthMiddleware.requireAdmin() as any);

/**
 * @swagger
 * /api/admin/establishments:
 *   post:
 *     summary: Criar novo estabelecimento
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *               - city
 *               - state
 *               - zipCode
 *               - cnpj
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Barbearia Moderna"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "contato@barberiamoderna.com"
 *               phone:
 *                 type: string
 *                 example: "(11) 99999-9999"
 *               address:
 *                 type: string
 *                 example: "Rua das Flores, 123"
 *               city:
 *                 type: string
 *                 example: "São Paulo"
 *               state:
 *                 type: string
 *                 example: "SP"
 *               zipCode:
 *                 type: string
 *                 example: "01234-567"
 *               cnpj:
 *                 type: string
 *                 example: "12.345.678/0001-90"
 *     responses:
 *       201:
 *         description: Estabelecimento criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acesso negado - apenas administradores
 */
adminRouter.post('/establishments', AdminEstablishmentController.create);

/**
 * @swagger
 * /api/admin/establishments/{id}:
 *   put:
 *     summary: Atualizar estabelecimento
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do estabelecimento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estabelecimento atualizado com sucesso
 *       404:
 *         description: Estabelecimento não encontrado
 *       403:
 *         description: Acesso negado - apenas administradores
 */
adminRouter.put('/establishments/:id', AdminEstablishmentController.update);

/**
 * @swagger
 * /api/admin/services:
 *   post:
 *     summary: Criar novo serviço
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - duration
 *               - price
 *               - establishmentId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Corte de Cabelo Masculino"
 *               description:
 *                 type: string
 *                 example: "Corte moderno e estiloso"
 *               duration:
 *                 type: number
 *                 example: 30
 *               price:
 *                 type: number
 *                 example: 3000
 *               establishmentId:
 *                 type: string
 *                 example: "establishment-uuid"
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado - apenas administradores
 */
adminRouter.post('/services', AdminServiceController.create);

/**
 * @swagger
 * /api/admin/employees:
 *   post:
 *     summary: Criar novo funcionário
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - establishmentId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao@barbearia.com"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *               phone:
 *                 type: string
 *                 example: "(11) 99999-8888"
 *               establishmentId:
 *                 type: string
 *                 example: "establishment-uuid"
 *     responses:
 *       201:
 *         description: Funcionário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado - apenas administradores
 */
adminRouter.post('/employees', AdminEmployeeController.create);

adminRouter.use('/categories', categoryRoutes);
adminRouter.use('/settings', settingsRoutes);

export { adminRouter };
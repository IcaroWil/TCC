import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../../controllers/auth/AuthController';

const authRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "admin@barbearia.com"
 *         password:
 *           type: string
 *           example: "senha123"
 *     
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           example: "João Silva"
 *         email:
 *           type: string
 *           format: email
 *           example: "joao@email.com"
 *         password:
 *           type: string
 *           example: "senha123"
 *         phone:
 *           type: string
 *           example: "(11) 99999-9999"
 *           pattern: "^\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}$"
 *           description: "Formato: (xx) XXXXX-XXXX"
 *         role:
 *           type: string
 *           enum: [ADMIN, EMPLOYEE, CLIENT]
 *           example: "CLIENT"
 *         establishmentId:
 *           type: string
 *           example: "establishment-uuid"
 *           description: "Obrigatório para EMPLOYEE"
 *     
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "user-uuid"
 *             name:
 *               type: string
 *               example: "João Silva"
 *             email:
 *               type: string
 *               example: "joao@email.com"
 *             role:
 *               type: string
 *               example: "CLIENT"
 *             establishmentId:
 *               type: string
 *               example: "establishment-uuid"
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login no sistema
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Email ou senha inválidos"
 *       401:
 *         description: Credenciais inválidas
 */
authRouter.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
], AuthController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Email já está em uso"
 *       422:
 *         description: Erro de validação
 */
authRouter.post('/register', [
  body('name')
    .isLength({ min: 2 })
    .withMessage('Nome deve ter pelo menos 2 caracteres')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Email deve ser válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('phone')
    .matches(/^\([0-9]{2}\) [0-9]{5}-[0-9]{4}$/)
    .withMessage('Telefone deve estar no formato (xx) XXXXX-XXXX'),
  body('role')
    .isIn(['ADMIN', 'EMPLOYEE', 'CLIENT'])
    .withMessage('Role deve ser ADMIN, EMPLOYEE ou CLIENT'),
  body('establishmentId')
    .optional()
    .isUUID()
    .withMessage('EstablishmentId deve ser um UUID válido')
], AuthController.register);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Obter perfil do usuário logado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     establishmentId:
 *                       type: string
 *       401:
 *         description: Token inválido ou expirado
 */
authRouter.get('/profile', AuthController.getProfile as any);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Fazer logout (invalidar token)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
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
 *                   example: "Logout realizado com sucesso"
 */
authRouter.post('/logout', AuthController.logout as any);

export { authRouter };
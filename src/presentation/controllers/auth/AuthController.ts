import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CreateUserUseCase } from '../../../application/use-cases/user/CreateUserUseCase';
import { AuthenticateUserUseCase } from '../../../application/use-cases/user/AuthenticateUserUseCase';
import { PrismaUserRepository } from '../../../infrastructure/database/repositories/PrismaUserRepository';
import { PrismaEstablishmentRepository } from '../../../infrastructure/database/repositories/PrismaEstablishmentRepository';
import { BcryptHashService } from '../../../infrastructure/services/BcryptHashService';
import { JwtTokenService } from '../../../infrastructure/services/JwtTokenService';
import { makeLoggerService } from '../../../main/factories/loggingFactory';
import { AuthenticatedRequest } from '../../middlewares/roleBasedAuthMiddleware';
import { PrismaClient } from '@prisma/client';

export class AuthController {
  private static prisma = new PrismaClient();
  private static userRepository = new PrismaUserRepository(AuthController.prisma);
  private static establishmentRepository = new PrismaEstablishmentRepository(AuthController.prisma);
  private static hashService = new BcryptHashService();
  private static tokenService = new JwtTokenService();
  private static loggerService = makeLoggerService();

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: errors.array()
        });
        return;
      }

      const { email, password } = req.body;

      const authenticateUserUseCase = new AuthenticateUserUseCase(
        AuthController.userRepository,
        AuthController.hashService,
        AuthController.tokenService
      );

      const result = await authenticateUserUseCase.execute({ email, password });

      AuthController.loggerService.info('User logged in successfully', {
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role
      });

      res.status(200).json({
        success: true,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
          role: result.user.role,
          establishmentId: result.user.establishmentId,
          createdAt: result.user.createdAt,
          updatedAt: result.user.updatedAt
        },
        token: result.token
      });
    } catch (error: any) {
      AuthController.loggerService.error('Login failed', {
        error: error.message,
        email: req.body?.email
      });

      res.status(401).json({
        success: false,
        error: error.message || 'Credenciais inválidas'
      });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        AuthController.loggerService.error('Validation errors in register', {
          errors: errors.array(),
          body: req.body
        });
        res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: errors.array()
        });
        return;
      }

      const { name, email, password, phone, role, establishmentId } = req.body;

      // Validar se establishmentId é obrigatório para EMPLOYEE
      if (role === 'EMPLOYEE' && !establishmentId) {
        res.status(400).json({
          success: false,
          error: 'EstablishmentId é obrigatório para funcionários'
        });
        return;
      }

      // Validar se establishment existe (se fornecido)
      if (establishmentId) {
        try {
          await AuthController.establishmentRepository.findById(establishmentId);
        } catch (error) {
          res.status(400).json({
            success: false,
            error: 'Estabelecimento não encontrado'
          });
          return;
        }
      }

      const createUserUseCase = new CreateUserUseCase(
        AuthController.userRepository,
        AuthController.hashService
      );

      const user = await createUserUseCase.execute({
        name,
        email,
        password,
        phone,
        role,
        establishmentId
      });

      // Gerar token para o usuário recém-criado
      const token = AuthController.tokenService.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      AuthController.loggerService.info('User registered successfully', {
        userId: user.id,
        email: user.email,
        role: user.role
      });

      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          establishmentId: user.establishmentId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        token
      });
    } catch (error: any) {
      AuthController.loggerService.error('Registration failed', {
        error: error.message,
        email: req.body?.email
      });

      if (error.message.includes('já está em uso') || error.message.includes('already exists')) {
        res.status(400).json({
          success: false,
          error: 'Email já está em uso'
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
      });
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Token inválido'
        });
        return;
      }

      const user = await AuthController.userRepository.findById(req.user.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          establishmentId: user.establishmentId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error: any) {
      AuthController.loggerService.error('Get profile failed', {
        error: error.message,
        userId: req.user?.userId
      });

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Em uma implementação real, você poderia invalidar o token
      // Por exemplo, adicionando-o a uma blacklist no Redis
      
      AuthController.loggerService.info('User logged out', {
        userId: req.user?.userId
      });

      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error: any) {
      AuthController.loggerService.error('Logout failed', {
        error: error.message,
        userId: req.user?.userId
      });

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}
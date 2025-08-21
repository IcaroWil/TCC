import { Request, Response } from 'express';
import { CreateEmployeeUseCase } from '../../../application/use-cases/admin';
import { PrismaUserRepository } from '../../../infrastructure/database/repositories/PrismaUserRepository';
import { JWTAuthService } from '../../../infrastructure/external-services/JWTAuthService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminEmployeeController {
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            const userRepository = new PrismaUserRepository(prisma);
            const authService = new JWTAuthService();
            const createEmployeeUseCase = new CreateEmployeeUseCase(userRepository, authService);
            const employee = await createEmployeeUseCase.execute(data);
            res.status(201).json(employee);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Internal server error'
            });
        }
    }
}
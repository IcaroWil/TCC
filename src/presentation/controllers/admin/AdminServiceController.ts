import { Request, Response } from 'express';
import { CreateServiceUseCase } from '../../../application/use-cases/admin';
import { CreateServiceDTO } from '../../../application/dtos/CreateServiceDTO';
import { PrismaServiceRepository } from '../../../infrastructure/database/repositories/PrismaServiceRepository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminServiceController {
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const data: CreateServiceDTO = req.body;
            const serviceRepository = new PrismaServiceRepository(prisma);
            const createServiceUseCase = new CreateServiceUseCase(serviceRepository);
            const service = await createServiceUseCase.execute(data);
            res.status(201).json(service);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Internal server error'
            });
        }
    }
}
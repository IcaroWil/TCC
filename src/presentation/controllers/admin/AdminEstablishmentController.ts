import { Request, Response } from 'express';
import { CreateEstablishmentUseCase, UpdateEstablishmentUseCase } from '../../../application/use-cases/admin';
import { CreateEstablishmentDTO } from '../../../application/dtos/CreateEstablishmentDTO';
import { PrismaEstablishmentRepository } from '../../../infrastructure/database/repositories/PrismaEstablishmentRepository';
import { PrismaBusinessCategoryRepository } from '../../../infrastructure/database/repositories/PrismaBusinessCategoryRepository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminEstablishmentController {
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const data: CreateEstablishmentDTO = req.body;
            const establishmentRepository = new PrismaEstablishmentRepository(prisma);
            const businessCategoryRepository = new PrismaBusinessCategoryRepository(prisma);
            const createEstablishmentUseCase = new CreateEstablishmentUseCase(establishmentRepository, businessCategoryRepository);
            const establishment = await createEstablishmentUseCase.execute(data);
            res.status(201).json(establishment);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Internal server error'
            });
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const data = { id, ...req.body };
            const establishmentRepository = new PrismaEstablishmentRepository(prisma);
            const updateEstablishmentUseCase = new UpdateEstablishmentUseCase(establishmentRepository);
            const establishment = await updateEstablishmentUseCase.execute(data);
            res.status(200).json(establishment);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Internal server error'
            });
        }
    }
}
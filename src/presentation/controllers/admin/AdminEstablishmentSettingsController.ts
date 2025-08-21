import { Request, Response } from 'express';
import { CreateEstablishmentSettingsUseCase } from '../../../application/use-cases/admin/settings/CreateEstablishmentSettingsUseCase';
import { UpdateEstablishmentSettingsUseCase } from '../../../application/use-cases/admin/settings/UpdateEstablishmentSettingsUseCase';
import { GetEstablishmentSettingsUseCase } from '../../../application/use-cases/admin/settings/GetEstablishmentSettingsUseCase';
import { GenerateSettingsTemplateUseCase } from '../../../application/use-cases/admin/settings/GenerateSettingsTemplateUseCase';
import { PrismaEstablishmentSettingsRepository } from '../../../infrastructure/database/repositories/PrismaEstablishmentSettingsRepository';
import { PrismaEstablishmentRepository } from '../../../infrastructure/database/repositories/PrismaEstablishmentRepository';
import { PrismaBusinessCategoryRepository } from '../../../infrastructure/database/repositories/PrismaBusinessCategoryRepository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminEstablishmentSettingsController {
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            const establishmentSettingsRepository = new PrismaEstablishmentSettingsRepository(prisma);
            const establishmentRepository = new PrismaEstablishmentRepository(prisma);
            const createEstablishmentSettingsUseCase = new CreateEstablishmentSettingsUseCase(
                establishmentSettingsRepository,
                establishmentRepository
            );
            
            const settings = await createEstablishmentSettingsUseCase.execute(data);
            
            res.status(201).json({
                success: true,
                data: settings,
                message: 'Configurações criadas com sucesso'
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Erro interno do servidor'
            });
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        try {
            const { establishmentId } = req.params;
            const data = { establishmentId, ...req.body };
            const establishmentSettingsRepository = new PrismaEstablishmentSettingsRepository(prisma);
            const updateEstablishmentSettingsUseCase = new UpdateEstablishmentSettingsUseCase(establishmentSettingsRepository);
            
            const settings = await updateEstablishmentSettingsUseCase.execute(data);
            
            res.status(200).json({
                success: true,
                data: settings,
                message: 'Configurações atualizadas com sucesso'
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Erro interno do servidor'
            });
        }
    }

    static async getByEstablishment(req: Request, res: Response): Promise<void> {
        try {
            const { establishmentId } = req.params;
            const establishmentSettingsRepository = new PrismaEstablishmentSettingsRepository(prisma);
            const getEstablishmentSettingsUseCase = new GetEstablishmentSettingsUseCase(establishmentSettingsRepository);
            
            const settings = await getEstablishmentSettingsUseCase.execute({ establishmentId });
            
            res.status(200).json({
                success: true,
                data: settings,
                message: 'Configurações encontradas com sucesso'
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Erro interno do servidor'
            });
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const { establishmentId } = req.params;
            const establishmentSettingsRepository = new PrismaEstablishmentSettingsRepository(prisma);
            
            await establishmentSettingsRepository.delete(establishmentId);
            
            res.status(200).json({
                success: true,
                message: 'Configurações removidas com sucesso'
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Erro interno do servidor'
            });
        }
    }

    static async generateTemplate(req: Request, res: Response): Promise<void> {
        try {
            const { businessCategoryId, subcategory } = req.query;
            
            if (!businessCategoryId || !subcategory) {
                res.status(400).json({
                    success: false,
                    message: 'businessCategoryId e subcategory são obrigatórios'
                });
                return;
            }

            const businessCategoryRepository = new PrismaBusinessCategoryRepository(prisma);
            const generateSettingsTemplateUseCase = new GenerateSettingsTemplateUseCase(businessCategoryRepository);
            
            const template = await generateSettingsTemplateUseCase.execute({
                businessCategoryId: businessCategoryId as string,
                subcategory: subcategory as string
            });
            
            res.status(200).json({
                success: true,
                data: template,
                message: 'Template gerado com sucesso'
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Erro interno do servidor'
            });
        }
    }
}
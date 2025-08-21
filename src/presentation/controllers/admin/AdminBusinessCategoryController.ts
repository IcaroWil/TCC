import { Request, Response } from 'express';
import { ListBusinessCategoriesUseCase } from '../../../application/use-cases/admin/category/ListBusinessCategoriesUseCase';
import { PrismaBusinessCategoryRepository } from '../../../infrastructure/database/repositories/PrismaBusinessCategoryRepository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminBusinessCategoryController {
    static async list(req: Request, res: Response): Promise<void> {
        try {
            const businessCategoryRepository = new PrismaBusinessCategoryRepository(prisma);
            const listBusinessCategoriesUseCase = new ListBusinessCategoriesUseCase(businessCategoryRepository);
            
            const categories = await listBusinessCategoriesUseCase.execute();
            
            res.status(200).json({
                success: true,
                data: categories,
                message: 'Categorias listadas com sucesso'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Erro interno do servidor'
            });
        }
    }

    static async findById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const businessCategoryRepository = new PrismaBusinessCategoryRepository(prisma);
            
            const category = await businessCategoryRepository.findById(id);
            
            if (!category) {
                res.status(404).json({
                    success: false,
                    message: 'Categoria não encontrada'
                });
                return;
            }
            
            res.status(200).json({
                success: true,
                data: category,
                message: 'Categoria encontrada com sucesso'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Erro interno do servidor'
            });
        }
    }

    async listCategories(req: Request, res: Response): Promise<void> {
        try {
            const businessCategoryRepository = new PrismaBusinessCategoryRepository(prisma);
            const listBusinessCategoriesUseCase = new ListBusinessCategoriesUseCase(businessCategoryRepository);
            
            const categories = await listBusinessCategoriesUseCase.execute();
            
            res.status(200).json({
                success: true,
                data: categories,
                message: 'Categorias listadas com sucesso'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Erro interno do servidor'
            });
        }
    }

    async getCategoryById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const businessCategoryRepository = new PrismaBusinessCategoryRepository(prisma);
            
            const category = await businessCategoryRepository.findById(id);
            
            if (!category) {
                res.status(404).json({
                    success: false,
                    message: 'Categoria não encontrada'
                });
                return;
            }
            
            res.status(200).json({
                success: true,
                data: category,
                message: 'Categoria encontrada com sucesso'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Erro interno do servidor'
            });
        }
    }

    async getCategoriesByType(req: Request, res: Response): Promise<void> {
        try {
            const { type } = req.params;
            const businessCategoryRepository = new PrismaBusinessCategoryRepository(prisma);
            
            const categories = await businessCategoryRepository.findByType(type as any);
            
            res.status(200).json({
                success: true,
                data: categories,
                message: 'Categorias por tipo listadas com sucesso'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Erro interno do servidor'
            });
        }
    }
}
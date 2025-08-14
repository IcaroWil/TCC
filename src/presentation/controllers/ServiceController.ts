import { Request, Response } from 'express';
import { CreateServiceUseCase } from '../../application/use-cases/service/CreateServiceUseCase';
import { GetServiceByIdUseCase } from '../../application/use-cases/service/GetServiceByIdUseCase';
import { ListServicesUseCase } from '../../application/use-cases/service/ListServicesUseCase';
import { UpdateServiceUseCase } from '../../application/use-cases/service/UpdateServiceUseCase';
import { DeleteServiceUseCase } from '../../application/use-cases/service/DeleteServiceUseCase';
import { AppError } from '../../shared/errors/AppError';

export class ServiceController {
    constructor(
        private readonly createServiceUseCase: CreateServiceUseCase,
        private readonly getServiceByIdUseCase: GetServiceByIdUseCase,
        private readonly listServicesUseCase: ListServicesUseCase,
        private readonly updateServiceUseCase: UpdateServiceUseCase,
        private readonly deleteServiceUseCase: DeleteServiceUseCase
    ) {}

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const { name, description, duration, price, establishmentId } = req.body;

            const service = await this.createServiceUseCase.execute({
                name,
                description,
                duration,
                price,
                establishmentId
            });

            return res.status(201).json({
                success: true,
                message: 'Service created successfully',
                data: {
                    id: service.id,
                    name: service.name,
                    description: service.description,
                    duration: service.duration,
                    price: service.price,
                    establishmentId: service.establishmentId,
                    isActive: service.isActive,
                    createdAt: service.createdAt,
                    updatedAt: service.updatedAt
                }
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Create service error:', error);
            return res.status(500).json({
                success: false,
                error: process.env.NODE_ENV === 'development' 
                    ? (error as Error).message 
                    : 'Internal server error'
            });
        }
    }

    async getById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            const service = await this.getServiceByIdUseCase.execute(id);

            return res.status(200).json({
                success: true,
                data: {
                    id: service.id,
                    name: service.name,
                    description: service.description,
                    duration: service.duration,
                    price: service.price,
                    establishmentId: service.establishmentId,
                    isActive: service.isActive,
                    createdAt: service.createdAt,
                    updatedAt: service.updatedAt
                }
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Get service by ID error:', error);
            return res.status(500).json({
                success: false,
                error: process.env.NODE_ENV === 'development'
                    ? (error as Error).message
                    : 'Internal server error'
            });
        }
    }

    async list(req: Request, res: Response): Promise<Response> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const establishmentId = req.query.establishmentId as string;
            const activeOnly = req.query.activeOnly === 'true';

            const result = await this.listServicesUseCase.execute({
                page,
                limit,
                establishmentId,
                activeOnly
            });

            return res.status(200).json({
                success: true,
                data: {
                    services: result.services.map(service => ({
                        id: service.id,
                        name: service.name,
                        description: service.description,
                        duration: service.duration,
                        price: service.price,
                        establishmentId: service.establishmentId,
                        isActive: service.isActive,
                        createdAt: service.createdAt,
                        updatedAt: service.updatedAt
                    })),
                    pagination: {
                        page: result.page,
                        limit: result.limit,
                        total: result.total,
                        totalPages: result.totalPages
                    }
                }
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('List services error:', error);
            return res.status(500).json({
                success: false,
                error: process.env.NODE_ENV === 'development' 
                    ? (error as Error).message 
                    : 'Internal server error'
            });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { name, description, duration, price, isActive } = req.body;

            const service = await this.updateServiceUseCase.execute({
                id,
                name,
                description,
                duration,
                price,
                isActive
            });

            return res.status(200).json({
                success: true,
                message: 'Service updated successfully',
                data: {
                    id: service.id,
                    name: service.name,
                    description: service.description,
                    duration: service.duration,
                    price: service.price,
                    establishmentId: service.establishmentId,
                    isActive: service.isActive,
                    createdAt: service.createdAt,
                    updatedAt: service.updatedAt
                }
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Update service error:', error);
            return res.status(500).json({
                success: false,
                error: process.env.NODE_ENV === 'development' 
                    ? (error as Error).message 
                    : 'Internal server error'
            });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            await this.deleteServiceUseCase.execute(id);

            return res.status(204).send();
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Delete service error:', error);
            return res.status(500).json({
                success: false,
                error: process.env.NODE_ENV === 'development' 
                    ? (error as Error).message 
                    : 'Internal server error'
            });
        }
    }
}
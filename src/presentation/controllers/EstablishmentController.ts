import { Request, Response } from 'express';
import { CreateEstablishmentUseCase } from '../../application/use-cases/establishment/CreateEstablishmentUseCase';
import { GetEstablishmentByIdUseCase } from '../../application/use-cases/establishment/GetEstablishmentByIdUseCase';
import { ListEstablishmentsUseCase } from '../../application/use-cases/establishment/ListEstablishmentsUseCase';
import { UpdateEstablishmentUseCase } from '../../application/use-cases/establishment/UpdateEstablishmentUseCase';
import { DeleteEstablishmentUseCase } from '../../application/use-cases/establishment/DeleteEstablishmentUseCase';
import { AppError } from '../../shared/errors/AppError';

export class EstablishmentController {
    constructor(
        private readonly createEstablishmentUseCase: CreateEstablishmentUseCase,
        private readonly getEstablishmentByIdUseCase: GetEstablishmentByIdUseCase,
        private readonly listEstablishmentsUseCase: ListEstablishmentsUseCase,
        private readonly updateEstablishmentUseCase: UpdateEstablishmentUseCase,
        private readonly deleteEstablishmentUseCase: DeleteEstablishmentUseCase
    ) {}

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const { name, email, phone, address, city, state, zipCode, cnpj } = req.body;

            const establishment = await this.createEstablishmentUseCase.execute({
                name,
                email,
                phone,
                address,
                city,
                state,
                zipCode,
                cnpj
            });

            return res.status(201).json({
                success: true,
                message: 'Establishment created successfully',
                data: {
                    id: establishment.id,
                    name: establishment.name,
                    email: establishment.email,
                    phone: establishment.phone,
                    address: establishment.address,
                    city: establishment.city,
                    state: establishment.state,
                    zipCode: establishment.zipCode,
                    cnpj: establishment.cnpj,
                    isActive: establishment.isActive,
                    createdAt: establishment.createdAt,
                    updatedAt: establishment.updatedAt
                }
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Create establishment error:', error);
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

            const establishment = await this.getEstablishmentByIdUseCase.execute(id);

            return res.status(200).json({
                success: true,
                data: {
                    id: establishment.id,
                    name: establishment.name,
                    email: establishment.email,
                    phone: establishment.phone,
                    address: establishment.address,
                    city: establishment.city,
                    state: establishment.state,
                    zipCode: establishment.zipCode,
                    cnpj: establishment.cnpj,
                    isActive: establishment.isActive,
                    createdAt: establishment.createdAt,
                    updatedAt: establishment.updatedAt
                }
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Get establishment by ID error:', error);
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
            const activeOnly = req.query.activeOnly === 'true';

            const result = await this.listEstablishmentsUseCase.execute({
                page,
                limit,
                activeOnly
            });

            return res.status(200).json({
                success: true,
                data: {
                    establishments: result.establishments.map(establishment => ({
                        id: establishment.id,
                        name: establishment.name,
                        email: establishment.email,
                        phone: establishment.phone,
                        address: establishment.address,
                        city: establishment.city,
                        state: establishment.state,
                        zipCode: establishment.zipCode,
                        cnpj: establishment.cnpj,
                        isActive: establishment.isActive,
                        createdAt: establishment.createdAt,
                        updatedAt: establishment.updatedAt
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

            console.error('List establishments error:', error);
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
            const { name, email, phone, address, city, state, zipCode, cnpj, isActive } = req.body;

            const establishment = await this.updateEstablishmentUseCase.execute({
                id,
                name,
                email,
                phone,
                address,
                city,
                state,
                zipCode,
                cnpj,
                isActive
            });

            return res.status(200).json({
                success: true,
                message: 'Establishment updated successfully',
                data: {
                    id: establishment.id,
                    name: establishment.name,
                    email: establishment.email,
                    phone: establishment.phone,
                    address: establishment.address,
                    city: establishment.city,
                    state: establishment.state,
                    zipCode: establishment.zipCode,
                    cnpj: establishment.cnpj,
                    isActive: establishment.isActive,
                    createdAt: establishment.createdAt,
                    updatedAt: establishment.updatedAt
                }
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Update establishment error:', error);
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

            await this.deleteEstablishmentUseCase.execute(id);

            return res.status(204).send();
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Delete establishment error:', error);
            return res.status(500).json({
                success: false,
                error: process.env.NODE_ENV === 'development' 
                    ? (error as Error).message 
                    : 'Internal server error'
            });
        }
    }
}
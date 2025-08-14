import { AuthenticateUserUseCase } from "../../application/use-cases/user/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../application/use-cases/user/CreateUserUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/user/GetUserByIdUseCase";
import { ListUsersUseCase } from "../../application/use-cases/user/ListUsersUseCase";
import { UpdateUserUseCase } from "../../application/use-cases/user/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../application/use-cases/user/DeleteUserUseCase";
import { AppError } from "../../shared/errors/AppError";
import { Request, Response } from "express";

export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly authenticateUserUseCase: AuthenticateUserUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly listUsersUseCase: ListUsersUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase
    ) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, name, phone, role, establishmentId } = req.body;
            
            const user = await this.createUserUseCase.execute({
                email,
                password,
                name,
                phone,
                role,
                establishmentId,
            });

            res.status(201).json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    establishmentId: user.establishmentId,
                    createdAt: user.createdAt,
                },
            });
        } catch (error) {
            console.error('Error creating user:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error',
                    details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
                });
            }
        }
    }

    async authenticate(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const result = await this.authenticateUserUseCase.execute({
                email,
                password,
            });

            res.status(200).json({
                success: true,
                data: result,
            })
        } catch (error) {
            console.error('Error authenticating user:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error',
                    details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
                });
            }
        }
    }

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as any).user;

            res.status(200).json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    role: user.role,
                    establishmentId: user.establishmentId,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const user = await this.getUserByIdUseCase.execute(id);

            res.status(200).json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    role: user.role,
                    establishmentId: user.establishmentId,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            });
        } catch (error) {
            console.error('Error getting user by id:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error',
                    details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
                });
            }
        }
    }

    async list(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this.listUsersUseCase.execute({ page, limit });

            res.status(200).json({
                success: true,
                data: {
                    users: result.users.map(user => ({
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        phone: user.phone,
                        role: user.role,
                        establishmentId: user.establishmentId,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    })),
                    pagination: {
                        page: result.page,
                        limit: result.limit,
                        total: result.total,
                        totalPages: result.totalPages,
                    }
                },
            });
        } catch (error) {
            console.error('Error listing users:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, phone, role, establishmentId } = req.body;

            const user = await this.updateUserUseCase.execute({
                id,
                name,
                phone,
                role,
                establishmentId,
            });

            res.status(200).json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    role: user.role,
                    establishmentId: user.establishmentId,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            });
        } catch (error) {
            console.error('Error updating user:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error',
                    details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
                });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            await this.deleteUserUseCase.execute(id);

            res.status(204).send();
        } catch (error) {
            console.error('Error deleting user:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error',
                    details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
                });
            }
        }
    }
}
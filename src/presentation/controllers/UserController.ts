import { AuthenticateUserUseCase } from "../../application/use-cases/user/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../application/use-cases/user/CreateUserUseCase";
import { AppError } from "../../shared/errors/AppError";
import { Request, Response } from "express";

export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly authenticateUserUseCase: AuthenticateUserUseCase
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
                    establishmentId: user.establihmentId,
                    createdAt: user.createdAt,
                },
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error',
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
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error', 
                });
            }
        }
    }

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            // O middleware de autenticação deve colocar o usuário no req
            const user = (req as any).user;

            res.status(200).json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    role: user.role,
                    establishmentId: user.establihmentId,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
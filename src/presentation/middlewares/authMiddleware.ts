import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../../domain/services/IAuthService";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

interface AuthenticatedRequest extends Request {
    user?: any;
}

export class AuthMiddleware {
    constructor(
        private readonly authService: IAuthService,
        private readonly userRepository: IUserRepository
    ) {}

    async handle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                res.status(401).json({
                    success: false,
                    error: 'Token not provided',
                });
                return;
            }

            const decoded = await this.authService.verifyToken(token);

            if (!decoded) {
                res.status(401).json({
                    success: false,
                    error: 'Invalid token',
                });
                return;
            }

            const user = await this.userRepository.findById(decoded.userId);

            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'User not found',
                });
                return;
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                error: 'Invalid token',
            });
        }
    }
}
import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
        [key: string]: any;
    };
}

export class AdminMiddleware {
    static requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
                return;
            }

            if (req.user.role !== 'ADMIN') {
                res.status(403).json({
                    success: false,
                    error: 'Access denied. Admin role required.',
                });
                return;
            }

            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';

type UserRole = 'CLIENT' | 'ADMIN' | 'EMPLOYEE';

export interface JWTUser {
  userId: string;
  email: string;
  role: string;
  establishmentId?: string;
}

export interface AuthenticatedRequest extends Omit<Request, 'user'> {
  user?: JWTUser;
}

export class RoleBasedAuthMiddleware {
    static requireRole(allowedRoles: UserRole[]) {
        return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            if (!allowedRoles.includes(req.user.role as UserRole)) {
                throw new AppError(`Access denied. Required roles: ${allowedRoles.join(', ')}`, 403);
            }

            next();
        };
    }

    static requireAdmin() {
        return this.requireRole(['ADMIN']);
    }

    static requireEmployee() {
        return this.requireRole(['EMPLOYEE']);
    }

    static requireClient() {
        return this.requireRole(['CLIENT']);
    }

    static requireAdminOrEmployee() {
        return this.requireRole(['ADMIN', 'EMPLOYEE']);
    }

    static requireEstablishmentOwnership() {
        return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            const { establishmentId } = req.params;

            if (req.user.role === 'ADMIN') {
                return next();
            }

            if (req.user.role === 'EMPLOYEE' && req.user.establishmentId === establishmentId) {
                return next();
            }

            throw new AppError('Access denied. You can only access your establishment data', 403);
        };
    }

    static requireClientOwnership() {
        return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            const { clientId } = req.params;

            if (req.user.role === 'CLIENT' && req.user.userId === clientId) {
                return next();
            }

            if (req.user.role === 'ADMIN') {
                return next();
            }

            throw new AppError('Access denied. You can only access your own data', 403);
        };
    }

    static requireAdminForWrite() {
        return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            const method = req.method;
            const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

            if (isWriteOperation && req.user.role !== 'ADMIN') {
                throw new AppError('Access denied. Only admins can perform write operations', 403);
            }

            next();
        };
    }

    static requireEmployeeReadOnly() {
        return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            if (req.user.role !== 'EMPLOYEE') {
                return next();
            }

            const method = req.method;
            const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

            if (isWriteOperation) {
                throw new AppError('Access denied. Employees have read-only access', 403);
            }

            next();
        };
    }

    static requireSameEstablishmentForEmployee() {
        return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            if (req.user.role !== 'EMPLOYEE') {
                return next();
            }

            const { establishmentId } = req.params;

            if (!req.user.establishmentId) {
                throw new AppError('Employee not associated with any establishment', 403);
            }

            if (req.user.establishmentId !== establishmentId) {
                throw new AppError('Access denied. You can only access your establishment data', 403);
            }

            next();
        };
    }
}
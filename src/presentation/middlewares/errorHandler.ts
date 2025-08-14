import { Request, Response, NextFunction } from "express";
import {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    BusinessRuleError,
    InternalServerError
} from "../../shared/errors/DomainError";
import { ILoggerService } from "../../domain/services/ILoggerService";
import { env } from "../../infrastructure/config/environment";

export class ErrorHandlerMiddleware {
    constructor(private readonly loggerService: ILoggerService) {}

    handle() {
        return (error: Error, req: Request, res: Response, next: NextFunction): void => {
            const errorId = this.generateErrorId();
            const errorContext = this.buildErrorContext(req, error, errorId);

            this.logError(error, errorContext);

            const errorResponse = this.buildErrorResponse(error, errorId);
            
            res.status(errorResponse.statusCode).json(errorResponse.body);
        };
    }

    private buildErrorContext(req: Request, error: Error, errorId: string) {
        return {
            errorId,
            method: req.method,
            url: req.originalUrl || req.url,
            userAgent: req.get('User-Agent'),
            ip: this.getClientIP(req),
            userId: this.getUserId(req),
            timestamp: new Date().toISOString(),
            headers: this.sanitizeHeaders(req.headers),
            body: this.sanitizeBody(req.body),
            params: req.params,
            query: req.query
        };
    }

    private logError(error: Error, context: any): void {
        if (error instanceof AppError) {
            if (error.isOperational) {
                if (error.statusCode >= 500) {
                    this.loggerService.error(`Operational Error: ${error.message}`, {
                        ...context,
                        error: {
                            name: error.name,
                            message: error.message,
                            statusCode: error.statusCode,
                            stack: error.stack
                        }
                    });
                } else {
                    this.loggerService.warn(`Client Error: ${error.message}`, {
                        ...context,
                        error: {
                            name: error.name,
                            message: error.message,
                            statusCode: error.statusCode
                        }
                    });
                }
            } else {
                this.loggerService.error(`System Error: ${error.message}`, {
                    ...context,
                    error: {
                        name: error.name,
                        message: error.message,
                        statusCode: error.statusCode,
                        stack: error.stack
                    }
                });
            }
        } else {
            this.loggerService.error(`Unhandled Error: ${error.message}`, {
                ...context,
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                }
            });
        }
    }

    private buildErrorResponse(error: Error, errorId: string) {
        if (error instanceof ValidationError) {
            return {
                statusCode: error.statusCode,
                body: {
                    success: false,
                    error: error.message,
                    field: error.field,
                    errorId,
                    timestamp: error.timestamp
                }
            };
        }

        if (error instanceof AuthenticationError) {
            return {
                statusCode: error.statusCode,
                body: {
                    success: false,
                    error: error.message,
                    errorId,
                    timestamp: error.timestamp
                }
            };
        }

        if (error instanceof AuthorizationError) {
            return {
                statusCode: error.statusCode,
                body: {
                    success: false,
                    error: error.message,
                    requiredRole: error.requiredRole,
                    errorId,
                    timestamp: error.timestamp
                }
            };
        }

        if (error instanceof NotFoundError) {
            return {
                statusCode: error.statusCode,
                body: {
                    success: false,
                    error: error.message,
                    resource: error.resource,
                    resourceId: error.resourceId,
                    errorId,
                    timestamp: error.timestamp
                }
            };
        }

        if (error instanceof ConflictError) {
            return {
                statusCode: error.statusCode,
                body: {
                    success: false,
                    error: error.message,
                    resource: error.resource,
                    conflictField: error.conflictField,
                    errorId,
                    timestamp: error.timestamp
                }
            };
        }

        if (error instanceof BusinessRuleError) {
            return {
                statusCode: error.statusCode,
                body: {
                    success: false,
                    error: error.message,
                    rule: error.rule,
                    errorId,
                    timestamp: error.timestamp
                }
            };
        }

        if (error instanceof AppError) {
            return {
                statusCode: error.statusCode,
                body: {
                    success: false,
                    error: error.message,
                    errorId,
                    timestamp: error.timestamp
                }
            };
        }

        if (error.name === 'PrismaClientValidationError') {
            return {
                statusCode: 400,
                body: {
                    success: false,
                    error: 'Dados inválidos fornecidos',
                    errorId,
                    timestamp: new Date().toISOString()
                }
            };
        }

        if (error.name === 'PrismaClientKnownRequestError') {
            const prismaError = error as any;
            if (prismaError.code === 'P2002') {
                return {
                    statusCode: 409,
                    body: {
                        success: false,
                        error: 'Recurso já existe',
                        errorId,
                        timestamp: new Date().toISOString()
                    }
                };
            }
        }

        return {
            statusCode: 500,
            body: {
                success: false,
                error: env.nodeEnv === 'production'
                    ? 'Internal server error'
                    : error.message,
                errorId,
                timestamp: new Date().toISOString()
            }
        };
    }

    private generateErrorId(): string {
        return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private getClientIP(req: Request): string {
        return (
            req.headers['x-forwarded-for'] as string ||
            req.headers['x-real-ip'] as string ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            'unknown'
        );
    }

    private getUserId(req: Request): string | undefined {
        return (req as any).user?.id;
    }

    private sanitizeHeaders(headers: any): any {
        const sanitized = { ...headers };
        delete sanitized.authorization;
        delete sanitized.cookie;
        return sanitized;
    }

    private sanitizeBody(body: any): any {
        if (!body) return body;
        
        const sanitized = { ...body };
        delete sanitized.password;
        delete sanitized.token;
        delete sanitized.secret;
        return sanitized;
    }
}

export const errorHandler = (loggerService: ILoggerService) => {
    const errorHandlerMiddleware = new ErrorHandlerMiddleware(loggerService);
    return errorHandlerMiddleware.handle();
};
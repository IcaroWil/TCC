import { Request, Response, NextFunction } from 'express';
import { ILoggerService } from '../../domain/services/ILoggerService';

interface RequestLogData {
  method: string;
  url: string;
  userAgent?: string;
  ip: string;
  userId?: string;
  duration: number;
  statusCode: number;
  contentLength?: number;
}

export class LoggingMiddleware {
  constructor(private readonly loggerService: ILoggerService) {}

  logRequests() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const startTime = Date.now();
      
      const requestData = {
        method: req.method,
        url: req.originalUrl || req.url,
        userAgent: req.get('User-Agent'),
        ip: this.getClientIP(req),
        userId: this.getUserId(req),
        timestamp: new Date().toISOString()
      };

      this.loggerService.debug('HTTP Request Started', requestData);

      const originalSend = res.send;
      const self = this;
      
      res.send = function(body: any) {
        const duration = Date.now() - startTime;
        
        const logData: RequestLogData = {
          ...requestData,
          duration,
          statusCode: res.statusCode,
          contentLength: body ? Buffer.byteLength(body, 'utf8') : 0
        };

        const logLevel = self.getLogLevel(res.statusCode);
        const message = `${req.method} ${req.originalUrl || req.url} - ${res.statusCode} - ${duration}ms`;

        switch (logLevel) {
          case 'error':
            self.loggerService.error(message, logData);
            break;
          case 'warn':
            self.loggerService.warn(message, logData);
            break;
          case 'info':
            self.loggerService.info(message, logData);
            break;
          default:
            self.loggerService.http(message, logData);
        }

        if (duration > 1000) {
          self.loggerService.performance(`HTTP ${req.method} ${req.originalUrl}`, duration, {
            statusCode: res.statusCode,
            userId: requestData.userId
          });
        }

        return originalSend.call(this, body);
      };

      next();
    };
  }

  logErrors() {
    return (error: Error, req: Request, res: Response, next: NextFunction): void => {
      const errorData = {
        method: req.method,
        url: req.originalUrl || req.url,
        userAgent: req.get('User-Agent'),
        ip: this.getClientIP(req),
        userId: this.getUserId(req),
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        timestamp: new Date().toISOString()
      };

      this.loggerService.error(`HTTP Error: ${error.message}`, errorData);
      next(error);
    };
  }

  logSecurityEvents() {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.path.includes('/login') || req.path.includes('/register')) {
        const originalSend = res.send;
        const self = this;
        
        res.send = function(body: any) {
          const success = res.statusCode < 400;
          
          self.loggerService.security('Authentication Attempt', {
            userId: success ? self.getUserId(req) : undefined,
            ip: self.getClientIP(req),
            userAgent: req.get('User-Agent'),
            action: req.path.includes('/login') ? 'LOGIN' : 'REGISTER',
            success,
            reason: success ? undefined : 'Invalid credentials'
          });

          return originalSend.call(this, body);
        };
      }

      if (req.headers.authorization) {
        const originalSend = res.send;
        const self = this;
        
        res.send = function(body: any) {
          if (res.statusCode === 401 || res.statusCode === 403) {
            self.loggerService.security('Unauthorized Access Attempt', {
              userId: self.getUserId(req),
              ip: self.getClientIP(req),
              userAgent: req.get('User-Agent'),
              action: `${req.method} ${req.originalUrl}`,
              success: false,
              reason: res.statusCode === 401 ? 'Invalid token' : 'Insufficient permissions'
            });
          }

          return originalSend.call(this, body);
        };
      }

      next();
    };
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

  private getLogLevel(statusCode: number): string {
    if (statusCode >= 500) return 'error';
    if (statusCode >= 400) return 'warn';
    if (statusCode >= 300) return 'info';
    return 'http';
  }
}
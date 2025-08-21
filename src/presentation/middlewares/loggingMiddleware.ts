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
      
      // Skip logging for static files and docs
      if (this.shouldSkipLogging(req.originalUrl || req.url)) {
        return next();
      }

      const originalSend = res.send;
      const self = this;
      
      res.send = function(body: any) {
        const duration = Date.now() - startTime;
        const url = req.originalUrl || req.url;
        
        // Only log errors and important requests
        if (res.statusCode >= 400) {
          self.loggerService.warn(`${req.method} ${url} - ${res.statusCode}`, {
            method: req.method,
            url,
            statusCode: res.statusCode,
            duration,
            ip: self.getClientIP(req)
          });
        } else if (self.isImportantRequest(url)) {
          self.loggerService.info(`${req.method} ${url} - ${res.statusCode}`, {
            method: req.method,
            url,
            statusCode: res.statusCode,
            duration
          });
        }

        // Log slow requests
        if (duration > 2000) {
          self.loggerService.warn(`Slow request: ${req.method} ${url} - ${duration}ms`, {
            method: req.method,
            url,
            duration,
            statusCode: res.statusCode
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
          const logLevel = success ? 'info' : 'warn';
          
          self.loggerService[logLevel](`Security Event: ${req.path.includes('/login') ? 'Login' : 'Registration'} Attempt`, {
            type: 'SECURITY',
            event: req.path.includes('/login') ? 'Login Attempt' : 'Registration Attempt',
            ip: self.getClientIP(req),
            userAgent: req.get('User-Agent'),
            action: req.path.includes('/login') ? 'LOGIN' : 'REGISTER',
            success,
            reason: success ? undefined : (req.path.includes('/login') ? 'Invalid credentials' : 'Validation failed')
          });

          return originalSend.call(this, body);
        };
      }

      next();
    };
  }

  private shouldSkipLogging(url: string): boolean {
    const skipPaths = [
      '/docs',
      '/favicon.ico',
      '/health',
      '.css',
      '.js',
      '.png',
      '.jpg',
      '.ico',
      '/swagger'
    ];
    
    return skipPaths.some(path => url.includes(path));
  }

  private isImportantRequest(url: string): boolean {
    const importantPaths = [
      '/api/users/login',
      '/api/users/register',
      '/api/users/profile'
    ];
    
    return importantPaths.some(path => url.includes(path));
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
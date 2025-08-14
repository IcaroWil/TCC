import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ILoggerService } from '../../domain/services/ILoggerService';
import { env } from '../config/environment';

export class WinstonLoggerService implements ILoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    const logFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.prettyPrint()
    );

    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({
        format: 'HH:mm:ss'
      }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        
        if (Object.keys(meta).length > 0) {
          msg += `\n${JSON.stringify(meta, null, 2)}`;
        }
        
        return msg;
      })
    );

    const transports: winston.transport[] = this.createTransports(logFormat, consoleFormat);

    return winston.createLogger({
      level: env.nodeEnv === 'production' ? 'info' : 'debug',
      format: logFormat,
      transports,
      exitOnError: false
    });
  }

  private createTransports(logFormat: winston.Logform.Format, consoleFormat: winston.Logform.Format): winston.transport[] {
    const transports: winston.transport[] = [];

    if (env.nodeEnv === 'development') {
      transports.push(
        new winston.transports.Console({
          format: consoleFormat,
          level: 'debug'
        })
      );
    }

    transports.push(
      new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        format: logFormat,
        maxSize: '20m',
        maxFiles: '14d',
        zippedArchive: true
      }),
      
      new DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        format: logFormat,
        maxSize: '20m',
        maxFiles: '7d',
        zippedArchive: true
      }),
      
      new DailyRotateFile({
        filename: 'logs/access-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'info',
        format: logFormat,
        maxSize: '20m',
        maxFiles: '7d',
        zippedArchive: true
      })
    );

    return transports;
  }

  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  http(message: string, meta?: any): void {
    this.logger.http(message, meta);
  }

  logOperation(operation: string, data: {
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    success: boolean;
    duration?: number;
    error?: string;
    metadata?: any;
  }): void {
    const logData = {
      type: 'OPERATION',
      operation,
      timestamp: new Date().toISOString(),
      ...data
    };

    if (data.success) {
      this.info(`Operation: ${operation}`, logData);
    } else {
      this.error(`Operation Failed: ${operation}`, logData);
    }
  }

  security(event: string, data: {
    userId?: string;
    ip?: string;
    userAgent?: string;
    action: string;
    success: boolean;
    reason?: string;
  }): void {
    const logData = {
      type: 'SECURITY',
      event,
      timestamp: new Date().toISOString(),
      ...data
    };

    if (data.success) {
      this.info(`Security Event: ${event}`, logData);
    } else {
      this.warn(`Security Alert: ${event}`, logData);
    }
  }

  performance(operation: string, duration: number, metadata?: any): void {
    const logData = {
      type: 'PERFORMANCE',
      operation,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      ...metadata
    };

    if (duration > 1000) {
      this.warn(`Slow Operation: ${operation}`, logData);
    } else {
      this.debug(`Performance: ${operation}`, logData);
    }
  }
}
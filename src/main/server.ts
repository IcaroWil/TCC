import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { validationResult } from 'express-validator';

import { connectDatabase } from '../infrastructure/config/database';
import { env } from '../infrastructure/config/environment';
import { SwaggerMiddleware } from '../presentation/middlewares/swaggerMiddleware';

import { adminRouter } from '../presentation/routes/admin/adminRoutes';
import { employeeRouter } from '../presentation/routes/employee/employeeRoutes';
import { clientRouter } from '../presentation/routes/client/clientRoutes';
import { authRouter } from '../presentation/routes/auth/authRoutes';

import {
    makeLoggerService,
    makeLoggingMiddleware,
    makeErrorHandler
} from './factories/loggingFactory';

const app = express();

const loggerService = makeLoggerService();
const loggingMiddleware = makeLoggingMiddleware();

loggerService.info('🚀 Starting SaaS Barbearia API Server', {
    environment: env.nodeEnv,
    port: env.port,
    timestamp: new Date().toISOString()
});

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    handler: (req, res) => {
        loggerService.warn('Rate limit exceeded', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            url: req.originalUrl
        });
        res.status(429).json({
            success: false,
            error: 'Too many requests from this IP, please try again later.'
        });
    }
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.use(loggingMiddleware.logRequests());
app.use(loggingMiddleware.logSecurityEvents());

const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    next();
};

app.get('/health', (req, res) => {
    const healthData = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.nodeEnv,
        version: '1.0.0'
    };
    
    loggerService.debug('Health check requested', healthData);
    res.status(200).json(healthData);
});

SwaggerMiddleware.setup(app);

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/client', clientRouter);

app.use(loggingMiddleware.logErrors());
app.use(makeErrorHandler());

app.use('*', (req, res) => {
    loggerService.warn('Route not found', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    
    res.status(404).json({
        success: false,
        error: 'Route not found',
        timestamp: new Date().toISOString()
    });
});

process.on('SIGINT', async () => {
    loggerService.info('SIGINT received, shutting down gracefully...');

    try {
        const { disconnectDatabase } = await import('../infrastructure/config/database');
        await disconnectDatabase();
        loggerService.info('Database disconnected successfully');
    } catch (error) {
        loggerService.error('Error during database disconnection', { error });
    }
    
    loggerService.info('Server shutdown completed');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    loggerService.info('SIGTERM received, shutting down gracefully...');
    
    try {
        const { disconnectDatabase } = await import('../infrastructure/config/database');
        await disconnectDatabase();
        loggerService.info('Database disconnected successfully');
    } catch (error) {
        loggerService.error('Error during database disconnection', { error });
    }
    
    loggerService.info('Server shutdown completed');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    loggerService.error('Uncaught Exception', {
        error: {
            name: error.name,
            message: error.message,
            stack: error.stack
        }
    });
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    loggerService.error('Unhandled Rejection', {
        reason,
        promise: promise.toString()
    });
    process.exit(1);
});

const startServer = async () => {
    try {
        loggerService.info('Connecting to database...');
        await connectDatabase();
        loggerService.info('Database connected successfully');
        
        app.listen(env.port, () => {
            loggerService.info('🚀 Server started successfully', {
                port: env.port,
                environment: env.nodeEnv,
                apiUrl: `http://localhost:${env.port}/api`,
                docsUrl: `http://localhost:${env.port}/docs`,
                healthUrl: `http://localhost:${env.port}/health`
            });
        });
    } catch (error) {
        loggerService.error('Failed to start server', { error });
        process.exit(1);
    }
};

startServer();

export default app;

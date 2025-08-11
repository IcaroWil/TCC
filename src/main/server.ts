import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { validationResult } from 'express-validator';

import { connectDatabase } from '../infrastructure/config/database';
import { env } from '../infrastructure/config/environment';
import { errorHandler } from '../presentation/middlewares/errorHandler';

import { createUserRoutes } from '../presentation/routes/userRoutes';
import { createAppointmentRoutes } from '../presentation/routes/appointmentRoutes';

import { makeUserController, makeAuthMiddleware } from './factories/userFactory';
import { makeAppointmentController } from './factories/appointmentFactory';

const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTED_URL,
    credentials: true,
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

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
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

const setupRoutes = () => {
    const userController = makeUserController();
    const appointmentController = makeAppointmentController();
    const authMiddleware = makeAuthMiddleware();

    app.use('/api/users', createUserRoutes(userController, authMiddleware));
    app.use('/api/appointments', createAppointmentRoutes(appointmentController, authMiddleware));
};

app.use(errorHandler);


app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');

    const { disconnectDatabase } = await import('../infrastructure/config/database');
    await disconnectDatabase();
    
    process.exit(0);
    });
  
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    
    const { disconnectDatabase } = await import('../infrastructure/config/database');
    await disconnectDatabase();
    
    process.exit(0);
    });
  
  const startServer = async () => {
    try {
        await connectDatabase();
    
        setupRoutes();
        
        app.listen(env.port, () => {
            console.log(`🚀 Server running on port ${env.port}`);
            console.log(`📊 Environment: ${env.nodeEnv}`);
            console.log(`🔗 API URL: http://localhost:${env.port}/api`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
  };
  
  startServer();

  export default app;

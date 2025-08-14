import { Router, Request, Response, NextFunction } from "express";
import { AppointmentController } from "../controllers/AppointmentController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { validateAppointmentCreation } from "../middlewares/validationMiddleware";
import { body } from "express-validator";
import { handleValidationErrors } from "../middlewares/validationMiddleware";

const validateAppointmentUpdate = [
    body('scheduledAt')
        .optional()
        .isISO8601()
        .withMessage('scheduledAt deve estar no formato ISO 8601')
        .custom((value) => {
            const appointmentDate = new Date(value);
            const now = new Date();
            if (appointmentDate <= now) {
                throw new Error('Data do agendamento deve ser no futuro');
            }
            return true;
        }),
    
    body('status')
        .optional()
        .isIn(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
        .withMessage('Status deve ser SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED ou CANCELLED'),
    
    body('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Notas não podem exceder 500 caracteres'),
    
    handleValidationErrors
];

export function createAppointmentRoutes(
    appointmentController: AppointmentController,
    authMiddleware: AuthMiddleware
): Router {
    const router = Router();

    router.post('/',
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        validateAppointmentCreation,
        (req: Request, res: Response) => appointmentController.create(req, res)
    );
    
    router.get('/',
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        (req: Request, res: Response) => appointmentController.list(req, res)
    );
    
    router.get('/:id',
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        (req: Request, res: Response) => appointmentController.getById(req, res)
    );
    
    router.put('/:id',
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        validateAppointmentUpdate,
        (req: Request, res: Response) => appointmentController.update(req, res)
    );
    
    router.delete('/:id',
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        (req: Request, res: Response) => appointmentController.delete(req, res)
    );

    return router;
}
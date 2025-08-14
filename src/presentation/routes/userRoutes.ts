import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { validateUserCreation, validateUserLogin } from "../middlewares/validationMiddleware";
import { body } from "express-validator";
import { handleValidationErrors } from "../middlewares/validationMiddleware";

const validateUserUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
        .withMessage('Nome deve conter apenas letras e espaços'),
    
    body('phone')
        .optional()
        .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
        .withMessage('Telefone deve estar no formato (XX) XXXXX-XXXX'),
    
    body('role')
        .optional()
        .isIn(['CLIENT', 'ADMIN', 'EMPLOYEE'])
        .withMessage('Role deve ser CLIENT, ADMIN ou EMPLOYEE'),
    
    body('establishmentId')
        .optional()
        .isUUID()
        .withMessage('establishmentId deve ser um UUID válido'),
    
    handleValidationErrors
];

export function createUserRoutes (
    userController: UserController,
    authMiddleware: AuthMiddleware
): Router {
    const router = Router();

    router.post('/register', validateUserCreation, (req: Request, res: Response) => userController.create(req, res));
    router.post('/login', validateUserLogin, (req: Request, res: Response) => userController.authenticate(req, res));
    
    router.get('/profile',
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        (req: Request, res: Response) => userController.getProfile(req, res)
    );
    
    router.get('/',
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        (req: Request, res: Response) => userController.list(req, res)
    );
    
    router.get('/:id',
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        (req: Request, res: Response) => userController.getById(req, res)
    );
    
    router.put('/:id',
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        validateUserUpdate,
        (req: Request, res: Response) => userController.update(req, res)
    );
    
    router.delete('/:id',
        (req: Request, res: Response, next: NextFunction) => authMiddleware.handle(req, res, next),
        (req: Request, res: Response) => userController.delete(req, res)
    );

    return router;
}
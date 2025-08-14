import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

export const validateUserCreation = [
    body('email')
        .isEmail()
        .withMessage('Email deve ter um formato válido')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter pelo menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número'),
    
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
        .withMessage('Nome deve conter apenas letras e espaços'),
    
    body('phone')
        .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
        .withMessage('Telefone deve estar no formato (XX) XXXXX-XXXX'),
    
    body('role')
        .isIn(['CLIENT', 'ADMIN', 'EMPLOYEE'])
        .withMessage('Role deve ser CLIENT, ADMIN ou EMPLOYEE'),
    
    body('establishmentId')
        .optional()
        .isUUID()
        .withMessage('establishmentId deve ser um UUID válido'),
    
    handleValidationErrors
];

export const validateUserLogin = [
    body('email')
        .isEmail()
        .withMessage('Email deve ter um formato válido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Senha é obrigatória'),
    
    handleValidationErrors
];

export const validateAppointmentCreation = [
    body('clientId')
        .isUUID()
        .withMessage('clientId deve ser um UUID válido'),
    
    body('employeeId')
        .isUUID()
        .withMessage('employeeId deve ser um UUID válido'),
    
    body('serviceId')
        .isUUID()
        .withMessage('serviceId deve ser um UUID válido'),
    
    body('establishmentId')
        .isUUID()
        .withMessage('establishmentId deve ser um UUID válido'),
    
    body('dateTime')
        .isISO8601()
        .withMessage('dateTime deve estar no formato ISO 8601')
        .custom((value) => {
            const appointmentDate = new Date(value);
            const now = new Date();
            if (appointmentDate <= now) {
                throw new Error('Data do agendamento deve ser no futuro');
            }
            return true;
        }),
    
    body('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Notas não podem exceder 500 caracteres'),
    
    handleValidationErrors
];

export const validateServiceCreation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Descrição não pode exceder 500 caracteres'),
    
    body('price')
        .isFloat({ min: 0.01 })
        .withMessage('Preço deve ser um valor positivo'),
    
    body('duration')
        .isInt({ min: 15, max: 480 })
        .withMessage('Duração deve ser entre 15 e 480 minutos'),
    
    body('establishmentId')
        .isUUID()
        .withMessage('establishmentId deve ser um UUID válido'),
    
    handleValidationErrors
];

export const validateServiceUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Descrição não pode exceder 500 caracteres'),
    
    body('price')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Preço deve ser um valor positivo'),
    
    body('duration')
        .optional()
        .isInt({ min: 15, max: 480 })
        .withMessage('Duração deve ser entre 15 e 480 minutos'),
    
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive deve ser um valor booleano'),
    
    handleValidationErrors
];

export const validateEstablishmentUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    
    body('email')
        .optional()
        .isEmail()
        .withMessage('Email deve ter um formato válido')
        .normalizeEmail(),
    
    body('phone')
        .optional()
        .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
        .withMessage('Telefone deve estar no formato (XX) XXXXX-XXXX'),
    
    body('address')
        .optional()
        .trim()
        .isLength({ min: 10, max: 200 })
        .withMessage('Endereço deve ter entre 10 e 200 caracteres'),
    
    body('city')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Cidade deve ter entre 2 e 100 caracteres'),
    
    body('state')
        .optional()
        .trim()
        .isLength({ min: 2, max: 2 })
        .withMessage('Estado deve ter exatamente 2 caracteres'),
    
    body('zipCode')
        .optional()
        .matches(/^\d{5}-?\d{3}$/)
        .withMessage('CEP deve estar no formato XXXXX-XXX'),
    
    body('cnpj')
        .optional()
        .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
        .withMessage('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX'),
    
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive deve ser um valor booleano'),
    
    handleValidationErrors
];

export const validateEstablishmentCreation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    
    body('email')
        .isEmail()
        .withMessage('Email deve ter um formato válido')
        .normalizeEmail(),
    
    body('phone')
        .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
        .withMessage('Telefone deve estar no formato (XX) XXXXX-XXXX'),
    
    body('address')
        .trim()
        .isLength({ min: 10, max: 200 })
        .withMessage('Endereço deve ter entre 10 e 200 caracteres'),
    
    body('city')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Cidade deve ter entre 2 e 100 caracteres'),
    
    body('state')
        .trim()
        .isLength({ min: 2, max: 2 })
        .withMessage('Estado deve ter exatamente 2 caracteres'),
    
    body('zipCode')
        .matches(/^\d{5}-?\d{3}$/)
        .withMessage('CEP deve estar no formato XXXXX-XXX'),
    
    body('cnpj')
        .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
        .withMessage('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX'),
    
    handleValidationErrors
];
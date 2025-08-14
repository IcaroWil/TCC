import { body } from 'express-validator';

export const createuserValidator = [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('name')
        .notEmpty()
        .withMessage('Name is required'),
    body('phone')
        .notEmpty()
        .withMessage('Phone is required'),
    body('role')
        .isIn(['CLIENT', 'ADMIN', 'EMPLOYEE'])
        .withMessage('Role must be CLIENT, ADMIN, or EMPLOYEE'),
]

export const authenticateUserValidator = [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];
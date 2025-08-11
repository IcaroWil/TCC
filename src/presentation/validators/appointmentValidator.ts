import { body } from 'express-validator';

export const createAppointmentValidator = [
    body('clientId')
        .isUUID()
        .withMessage('Client ID must be a valid UUID'),
    body('serviceId')
        .isUUID()
        .withMessage('Service ID must be a valid UUID'),
    body('establishmentId')
        .isUUID()
        .withMessage('Establishment ID must be a valid UUID'),
    body('employeeId')
        .isUUID()
        .withMessage('Employee ID must be a valid UUID'),
    body('scheduledAt')
        .isISO8601()
        .withMessage('Scheduled date must be a valid ISO 8601 date'),
];
import { Request, Response } from "express";
import { CreateAppointmentUsecase } from "../../application/use-cases/appointment/CreateAppointmentUseCase";
import { ListAppointmentsUseCase } from "../../application/use-cases/appointment/ListAppointmentsUseCase";
import { GetAppointmentByIdUseCase } from "../../application/use-cases/appointment/GetAppointmentByIdUseCase";
import { UpdateAppointmentUseCase } from "../../application/use-cases/appointment/UpdateAppointmentUseCase";
import { DeleteAppointmentUseCase } from "../../application/use-cases/appointment/DeleteAppointmentUseCase";
import { AppError } from "../../shared/errors/AppError";

export class AppointmentController {
    constructor(
        private readonly createAppointmentUseCase: CreateAppointmentUsecase,
        private readonly listAppointmentsUseCase: ListAppointmentsUseCase,
        private readonly getAppointmentByIdUseCase: GetAppointmentByIdUseCase,
        private readonly updateAppointmentUseCase: UpdateAppointmentUseCase,
        private readonly deleteAppointmentUseCase: DeleteAppointmentUseCase
    ) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { clientId, serviceId, establishmentId, employeeId, scheduledAt, notes } = req.body;

            const parsedDate = new Date(scheduledAt);
            if (isNaN(parsedDate.getTime())) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid date format for scheduledAt',
                });
                return;
            }

            const appointment = await this.createAppointmentUseCase.execute({
                clientId,
                serviceId,
                establishmentId,
                employeeId,
                scheduledAt: parsedDate,
                notes,
            });

            res.status(201).json({
                success: true,
                data: appointment,
            });
        } catch (error) {
            console.error('Error creating appointment:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error',
                    details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
                });
            }
        }
    }

    async list(req: Request, res: Response): Promise<void> {
        try {
            const { establishmentId, startDate, endDate, employeeId, clientId } = req.query;

            const appointments = await this.listAppointmentsUseCase.execute({
                establishmentId: establishmentId as string,
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined,
                employeeId: employeeId as string,
                clientId: clientId as string,
            });

            res.status(200).json({
                success: true,
                data: appointments,
            });
        } catch (error) {
            console.error('Error listing appointments:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
            });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const appointment = await this.getAppointmentByIdUseCase.execute(id);

            res.status(200).json({
                success: true,
                data: {
                    id: appointment.id,
                    clientId: appointment.clientId,
                    serviceId: appointment.serviceId,
                    establishmentId: appointment.establishmentId,
                    employeeId: appointment.employeeId,
                    scheduledAt: appointment.scheduledAt,
                    status: appointment.status,
                    notes: appointment.notes,
                    createdAt: appointment.createdAt,
                    updatedAt: appointment.updatedAt,
                },
            });
        } catch (error) {
            console.error('Error getting appointment by id:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error',
                    details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
                });
            }
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { scheduledAt, status, notes } = req.body;

            const appointment = await this.updateAppointmentUseCase.execute({
                id,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
                status,
                notes,
            });

            res.status(200).json({
                success: true,
                data: {
                    id: appointment.id,
                    clientId: appointment.clientId,
                    serviceId: appointment.serviceId,
                    establishmentId: appointment.establishmentId,
                    employeeId: appointment.employeeId,
                    scheduledAt: appointment.scheduledAt,
                    status: appointment.status,
                    notes: appointment.notes,
                    createdAt: appointment.createdAt,
                    updatedAt: appointment.updatedAt,
                },
            });
        } catch (error) {
            console.error('Error updating appointment:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error',
                    details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
                });
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            await this.deleteAppointmentUseCase.execute(id);

            res.status(204).send();
        } catch (error) {
            console.error('Error deleting appointment:', error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error',
                    details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
                });
            }
        }
    }
}
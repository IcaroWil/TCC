import { Request, Response } from "express";
import { CreateAppointmentUsecase } from "../../application/use-cases/appointment/CreateAppointmentUseCase";
import { ListAppointmentsUseCase } from "../../application/use-cases/appointment/ListAppointmentsUseCase";
import { AppError } from "../../shared/errors/AppError";

export class AppointmentController {
    constructor(
        private readonly createAppointmentUseCase: CreateAppointmentUsecase,
        private readonly listAppointmentsUseCase: ListAppointmentsUseCase
    ) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { clientId, serviceId, establishmentId, employeeId, scheduledAt, notes } = req.body;

            const appointment = await this.createAppointmentUseCase.execute({
                clientId,
                serviceId,
                establishmentId,
                employeeId,
                scheduledAt: new Date(scheduledAt),
                notes,
            });

            res.status(201).json({
                success: true,
                data: appointment,
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error',
                });
            }
        }
    }

    async list(req: Request, res: Response): Promise<void> {
        try {
            const { establishmentId, startDate, endDate, employeeId, clientId } = req.body;

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
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
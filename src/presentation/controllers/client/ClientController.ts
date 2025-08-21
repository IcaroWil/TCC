import { Request, Response } from 'express';
import { 
    ListEstablishmentsUseCase, 
    GetEstablishmentServicesUseCase,
    CreateAppointmentUseCase,
    ListMyAppointmentsUseCase 
} from '../../../application/use-cases/client';

export class ClientController {
    constructor(
        private readonly listEstablishmentsUseCase: ListEstablishmentsUseCase,
        private readonly getEstablishmentServicesUseCase: GetEstablishmentServicesUseCase,
        private readonly createAppointmentUseCase: CreateAppointmentUseCase,
        private readonly listMyAppointmentsUseCase: ListMyAppointmentsUseCase
    ) {}

    async listEstablishments(req: Request, res: Response): Promise<void> {
        try {
            const { page, limit } = req.query;
            const result = await this.listEstablishmentsUseCase.execute({
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined
            });
            res.status(200).json(result);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ 
                message: error.message || 'Internal server error' 
            });
        }
    }

    async getEstablishmentServices(req: Request, res: Response): Promise<void> {
        try {
            const { establishmentId } = req.params;
            const services = await this.getEstablishmentServicesUseCase.execute({
                establishmentId
            });
            res.status(200).json(services);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ 
                message: error.message || 'Internal server error' 
            });
        }
    }

    async createAppointment(req: Request, res: Response): Promise<void> {
        try {
            const clientId = req.user?.id;
            
            if (!clientId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const data = { ...req.body, clientId };
            const appointment = await this.createAppointmentUseCase.execute(data);
            res.status(201).json(appointment);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ 
                message: error.message || 'Internal server error' 
            });
        }
    }

    async listMyAppointments(req: Request, res: Response): Promise<void> {
        try {
            const clientId = req.user?.id;
            
            if (!clientId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const appointments = await this.listMyAppointmentsUseCase.execute({
                clientId
            });
            res.status(200).json(appointments);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ 
                message: error.message || 'Internal server error' 
            });
        }
    }
}
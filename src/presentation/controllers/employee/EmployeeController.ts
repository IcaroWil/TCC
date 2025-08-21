import { Request, Response } from 'express';
import { GetEstablishmentDetailsUseCase, ListServicesUseCase } from '../../../application/use-cases/employee';

export class EmployeeController {
    constructor(
        private readonly getEstablishmentDetailsUseCase: GetEstablishmentDetailsUseCase,
        private readonly listServicesUseCase: ListServicesUseCase
    ) {}

    async getEstablishmentDetails(req: Request, res: Response): Promise<void> {
        try {
            const { establishmentId } = req.params;
            const employeeId = req.user?.id;
            
            if (!employeeId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            
            const establishment = await this.getEstablishmentDetailsUseCase.execute({
                establishmentId,
                employeeId
            });
            
            res.status(200).json(establishment);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ 
                message: error.message || 'Internal server error' 
            });
        }
    }

    async listServices(req: Request, res: Response): Promise<void> {
        try {
            const { establishmentId } = req.params;
            const employeeId = req.user?.id;
            
            if (!employeeId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            
            const services = await this.listServicesUseCase.execute({
                establishmentId,
                employeeId
            });
            
            res.status(200).json(services);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ 
                message: error.message || 'Internal server error' 
            });
        }
    }
}
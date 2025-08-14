import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { AppError } from "../../../shared/errors/AppError";
import { IUseCase } from "../../interfaces/IUseCase";

export class DeleteAppointmentUseCase implements IUseCase<string, void> {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository
    ) {}

    async execute(id: string): Promise<void> {
        const existingAppointment = await this.appointmentRepository.findById(id);
        
        if (!existingAppointment) {
            throw new AppError('Appointment not found', 404);
        }

        if (existingAppointment.status === 'IN_PROGRESS' || existingAppointment.status === 'COMPLETED') {
            throw new AppError('Cannot delete appointments that are in progress or completed', 400);
        }

        await this.appointmentRepository.delete(id);
    }
}
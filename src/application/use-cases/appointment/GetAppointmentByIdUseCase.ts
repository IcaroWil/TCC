import { Appointment } from "../../../domain/entities/Appointment";
import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { AppError } from "../../../shared/errors/AppError";
import { IUseCase } from "../../interfaces/IUseCase";

export class GetAppointmentByIdUseCase implements IUseCase<string, Appointment> {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository
    ) {}

    async execute(id: string): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findById(id);
        
        if (!appointment) {
            throw new AppError('Appointment not found', 404);
        }

        return appointment;
    }
}
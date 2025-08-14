import { Appointment, AppointmentStatus } from "../../../domain/entities/Appointment";
import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { AppError } from "../../../shared/errors/AppError";
import { IUseCase } from "../../interfaces/IUseCase";

interface UpdateAppointmentRequest {
    id: string;
    scheduledAt?: Date;
    status?: AppointmentStatus;
    notes?: string;
}

export class UpdateAppointmentUseCase implements IUseCase<UpdateAppointmentRequest, Appointment> {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository
    ) {}

    async execute(request: UpdateAppointmentRequest): Promise<Appointment> {
        const existingAppointment = await this.appointmentRepository.findById(request.id);
        
        if (!existingAppointment) {
            throw new AppError('Appointment not found', 404);
        }

        if (request.scheduledAt && request.scheduledAt <= new Date()) {
            throw new AppError('Appointment date must be in the future', 400);
        }

        if (existingAppointment.status === 'COMPLETED' || existingAppointment.status === 'CANCELLED') {
            throw new AppError('Cannot update completed or cancelled appointments', 400);
        }

        const updatedAppointment = new Appointment(
            existingAppointment.id,
            existingAppointment.clientId,
            existingAppointment.serviceId,
            existingAppointment.establishmentId,
            existingAppointment.employeeId,
            request.scheduledAt ?? existingAppointment.scheduledAt,
            request.status ?? existingAppointment.status,
            request.notes !== undefined ? request.notes : existingAppointment.notes,
            existingAppointment.createdAt,
            new Date() // updatedAt
        );

        return await this.appointmentRepository.update(updatedAppointment);
    }
}
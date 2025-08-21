import { IAppointmentRepository } from "../../../../domain/repositories/IAppointmentRepository";
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { Appointment } from "../../../../domain/entities/Appointment";
import { AppError } from "../../../../shared/errors/AppError";
import { IUseCase } from "../../../interfaces/IUseCase";

interface CreateAppointmentRequest {
    clientId: string;
    serviceId: string;
    establishmentId: string;
    employeeId: string;
    scheduledAt: Date;
    notes?: string;
}

export class CreateAppointmentUseCase implements IUseCase<CreateAppointmentRequest, Appointment> {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly serviceRepository: IServiceRepository,
        private readonly userRepository: IUserRepository
    ) {}

    async execute(request: CreateAppointmentRequest): Promise<Appointment> {
        const service = await this.serviceRepository.findById(request.serviceId);
        if (!service) {
            throw new AppError("Service not found", 404);
        }

        if (service.establishmentId !== request.establishmentId) {
            throw new AppError("Service does not belong to this establishment", 400);
        }

        const employee = await this.userRepository.findById(request.employeeId);
        if (!employee || employee.role !== 'EMPLOYEE') {
            throw new AppError("Employee not found", 404);
        }

        if (employee.establishmentId !== request.establishmentId) {
            throw new AppError("Employee does not work at this establishment", 400);
        }

        const client = await this.userRepository.findById(request.clientId);
        if (!client || client.role !== 'CLIENT') {
            throw new AppError("Client not found", 404);
        }

        if (request.scheduledAt <= new Date()) {
            throw new AppError("Appointment must be scheduled for a future date", 400);
        }

        const conflictingAppointments = await this.appointmentRepository.findConflicts(
            request.employeeId,
            request.scheduledAt,
            service.duration
        );

        if (conflictingAppointments.length > 0) {
            throw new AppError("Employee is not available at this time", 409);
        }

        const appointment = Appointment.create({
            clientId: request.clientId,
            serviceId: request.serviceId,
            establishmentId: request.establishmentId,
            employeeId: request.employeeId,
            scheduledAt: request.scheduledAt,
            note: request.notes
        });

        return await this.appointmentRepository.create(appointment);
    }
}
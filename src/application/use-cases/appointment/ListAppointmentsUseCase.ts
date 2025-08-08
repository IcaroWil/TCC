import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { AppointmentResponseDTO } from "../../dtos/CreateAppointmentDTO";
import { IUseCase } from "../../interfaces/IUseCase";

interface ListAppointmentsRequest {
    establishmentId: string;
    startDate?: Date;
    endDate?: Date;
    employeeId?: string;
    clientId?: string;
}

export class ListAppointmentsUseCase implements IUseCase<ListAppointmentsRequest, AppointmentResponseDTO[]> {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository
    ) {}

    async execute(request: ListAppointmentsRequest): Promise<AppointmentResponseDTO[]> {
        let appointment;

        if (request.startDate && request.endDate) {
            appointment = await this.appointmentRepository.findByDateRange(
                request.establishmentId,
                request.startDate,
                request.endDate
            );
        } else if (request.employeeId) {
            appointment = await this.appointmentRepository.findByEmployee(request.employeeId);
        } else if (request.clientId) {
            appointment = await this.appointmentRepository.findByClient(request.clientId);
        } else {
            appointment = await this.appointmentRepository.findByEstablishment(request.establishmentId);
        }

        return appointment.map(appointment => ({
            id: appointment.id,
            clientId: appointment.clientId,
            serviceId: appointment.serviceId,
            establishmentId: appointment.establishmentId,
            employeeId: appointment.employeeId,
            scheduledAt: appointment.scheduledAt,
            status: appointment.status,
            notes: appointment.notes,
            createdAt: appointment.createdAt
        }));
    }
}
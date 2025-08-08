import { Appointment } from "../../../domain/entities/Appointment";
import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { INotificationService } from "../../../domain/services/INotificationService";
import { AppointmentResponseDTO, CreateAppointmentDTO } from "../../dtos/CreateAppointmentDTO";
import { IUseCase } from "../../interfaces/IUseCase";

export class CreateAppointmentUsecase implements IUseCase<CreateAppointmentDTO, AppointmentResponseDTO> {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly serviceRepository: IServiceRepository,
        private readonly userRepository: IUserRepository,
        private readonly notificationService: INotificationService
    ) {}

    async execute(request: CreateAppointmentDTO): Promise<AppointmentResponseDTO> {
        // Validar se o serviço existe
        const service = await this.serviceRepository.findById(request.serviceId);
        if (!service) {
            throw new AppError('Service not found', 404);
        }

        // Validar se o cliente existe
        const employee = await this.userRepository.findById(request.employeeId);
        if (!employee || !employee.isEmployee()) {
            throw new AppError('Employee not found', 404);
        }
        
        // Validar se o cliente existe 
        const client = await this.userRepository.findById(request.clientId);
        if (!client) {
            throw new AppError('Client not found', 404);
        }

        // Verificar conflitos de horario
        const conflicts = await this.appointmentRepository.findConflicts(
            request.employeeId,
            request.scheduledAt,
            service.duration
        );

        if (conflicts.length > 0) {
            throw new AppError('Time slot is not available', 409);
        }

        // Criar agendamento
        const appointment = Appointment.create(request);

        // Salva no repositorio
        const savedAppointment = await this.appointmentRepository.create(appointment);

        // Envia notificação
        await this.notificationService.sendAppointmentConfirmation(savedAppointment, client.email);

        return {
            id: savedAppointment.id,
            clientId: savedAppointment.clientId,
            serviceId: savedAppointment.serviceId,
            establishmentId: savedAppointment.establishmentId,
            employeeId: savedAppointment.employeeId,
            scheduledAt: savedAppointment.scheduledAt,
            status: savedAppointment.status,
            notes: savedAppointment.notes,
            createdAt: savedAppointment.createdAt
        };
    }
}
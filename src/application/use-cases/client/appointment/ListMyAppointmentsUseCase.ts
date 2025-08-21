import { IAppointmentRepository } from "../../../../domain/repositories/IAppointmentRepository";
import { Appointment } from "../../../../domain/entities/Appointment";
import { IUseCase } from "../../../interfaces/IUseCase";

interface ListMyAppointmentsRequest {
    clientId: string;
}

export class ListMyAppointmentsUseCase implements IUseCase<ListMyAppointmentsRequest, Appointment[]> {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository
    ) {}

    async execute(request: ListMyAppointmentsRequest): Promise<Appointment[]> {
        return await this.appointmentRepository.findByClient(request.clientId);
    }
}
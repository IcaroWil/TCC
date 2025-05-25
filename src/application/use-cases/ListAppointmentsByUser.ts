import { IAppointmentRepository } from "../../ports/IAppointmentRepository";
import { Appointment } from "../../domain/entities/Appointment";

export class ListAppointmentsByUser {
  constructor(private appointmentRepo: IAppointmentRepository) {}

  async execute(userId: string): Promise<Appointment[]> {
    return this.appointmentRepo.findByUserId(userId);
  }
}

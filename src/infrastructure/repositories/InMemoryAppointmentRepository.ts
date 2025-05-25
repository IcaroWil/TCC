import { IAppointmentRepository } from "../../ports/IAppointmentRepository";
import { Appointment } from "../../domain/entities/Appointment";

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  async create(appointment: Appointment): Promise<void> {
    this.appointments.push(appointment);
  }

  async findByUserId(userId: string): Promise<Appointment[]> {
    return this.appointments.filter(a => a.userId === userId);
  }
}

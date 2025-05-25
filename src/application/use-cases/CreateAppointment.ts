import { Appointment } from "../../domain/entities/Appointment";
import { IAppointmentRepository } from "../../ports/IAppointmentRepository";
import { v4 as uuidv4 } from "uuid";

export class CreateAppointment {
  constructor(private appointmentRepo: IAppointmentRepository) {}

  async execute(userId: string, date: string, service: string): Promise<void> {
    const appointment = new Appointment(uuidv4(), userId, new Date(date), service);
    await this.appointmentRepo.create(appointment);
  }
}

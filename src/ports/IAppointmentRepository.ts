import { Appointment } from "../domain/entities/Appointment";

export interface IAppointmentRepository {
  create(appointment: Appointment): Promise<void>;
  findByUserId(userId: string): Promise<Appointment[]>;
}

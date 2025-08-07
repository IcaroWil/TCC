import { Appointment, AppointmentStatus } from '../entities/Appointment';

export interface IAppointmentRepository {
  create(appointment: Appointment): Promise<Appointment>;
  findById(id: string): Promise<Appointment | null>;
  findByClient(clientId: string): Promise<Appointment[]>;
  findByEmployee(employeeId: string): Promise<Appointment[]>;
  findByEstablishment(establishmentId: string): Promise<Appointment[]>;
  findByDateRange(establishmentId: string, startDate: Date, endDate: Date): Promise<Appointment[]>;
  findByStatus(establishmentId: string, status: AppointmentStatus): Promise<Appointment[]>;
  findConflicts(employeeId: string, scheduledAt: Date, duration: number): Promise<Appointment[]>;
  update(appointment: Appointment): Promise<Appointment>;
  delete(id: string): Promise<void>;
  list(page: number, limit: number): Promise<{appointments: Appointment[], total: number}>;
}
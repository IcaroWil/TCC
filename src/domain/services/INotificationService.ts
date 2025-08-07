import { Appointment } from "../entities/Appointment";

export interface INotificationService {
    sendEmail(to: string, subject: string, body: string): Promise<void>;
    sendSMS(phone: string, message: string): Promise<void>;
    sendAppointmentConfirmation(appointment: Appointment, clientEmail: string): Promise<void>;
    sendAppointmentReminder(Appointment: Appointment, clientEmail: string): Promise<void>;
}
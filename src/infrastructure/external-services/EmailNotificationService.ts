import nodemailer from 'nodemailer';
import { INotificationService } from "../../domain/services/INotificationService";
import { env } from '../config/environment';
import { Appointment } from '../../domain/entities/Appointment';

export class EmailNotificationService implements INotificationService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: env.emailService.host,
            port: env.emailService.port,
            secure: false,
            auth: {
                user: env.emailService.user,
                pass: env.emailService.password,
            },
        });
    }

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        await this.transporter.sendMail({
            from: env.emailService.user,
            to,
            subject,
            html: body,
        });
    }

    async sendSMS(phone: string, message: string): Promise<void> {
        // Implementar com Twilio ou outro provedor SMS
        console.log(`SMS to ${phone}: ${message}`);
    }

    async sendAppointmentConfirmation(appointment: Appointment, clientEmail: string): Promise<void> {
        const subject = 'Agendamento Confirmado';
        const body = `
            <h2>Seu agendamento foi confirmado!</h2>
            <p><strong>Horário:</strong> ${appointment.scheduledAt.toLocaleDateString('pt-BR')}</p>
            <p><strong>ID do Agendamento:</strong> ${appointment.id}</p>
            ${appointment.notes ? `<p><strong>Observações:</strong> ${appointment.notes}</p>` : ''}
            <p>Agradecemos pela preferência!</p>
        `;

        await this.sendEmail(clientEmail, subject, body);
    }

    async sendAppointmentReminder(appointment: Appointment, clientEmail: string): Promise<void> {
        const subject = 'Lembrete de Agendamento';
        const body = `
            <h2>Lembrete: Você tem um agendamento hoje!</h2>
            <p><strong>Horário:</strong> ${appointment.scheduledAt.toLocaleDateString('pt-BR')}</p>
            <p><strong>ID do Agendamento:</strong> ${appointment.id}</p>
            ${appointment.notes ? `<p><strong>Observações:</strong> ${appointment.notes}</p>` : ''}
            <p>Não se esqueça do seu horário!</p>
        `;

        await this.sendEmail(clientEmail, subject, body);
    }
}
import { AppError } from "../../shared/errors/AppError";

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export class Appointment {
    constructor(
        public readonly id: string,
        public readonly clientId: string,
        public readonly serviceId: string,
        public readonly establishmentId: string,
        public readonly employeeId: string,
        public readonly scheduledAt: Date,
        public readonly status: AppointmentStatus,
        public readonly notes?: string,
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date()
    ) {}

    static create(props: {
        clientId: string;
        serviceId: string;
        establishmentId: string;
        employeeId: string;
        scheduledAt: Date;
        note?: string;
    }): Appointment {
        const id = crypto.randomUUID();
        return new Appointment(
            id,
            props.clientId,
            props.serviceId,
            props.establishmentId,
            props.employeeId,
            props.scheduledAt,
            'SCHEDULED',
            props.note
        );
    }

    confirm(): Appointment {
        if (this.status !== 'SCHEDULED') {
            throw new AppError('Only scheduled appointments can be confirmed', 400);
        }

        return new Appointment(
            this.id,
            this.clientId,
            this.serviceId,
            this.establishmentId,
            this.employeeId,
            this.scheduledAt,
            'CONFIRMED',
            this.notes,
            this.createdAt,
            new Date()
        );
    }

    cancel(): Appointment {
        if (this.status === 'COMPLETED' || this.status === 'CANCELLED') {
            throw new AppError('Cannot cancel completed or already cancelled appointments', 400);
        }

        return new Appointment(
            this.id,
            this.clientId,
            this.serviceId,
            this.establishmentId,
            this.employeeId,
            this.scheduledAt,
            'CANCELLED',
            this.notes,
            this.createdAt,
            new Date()
        );
    }

    complete(): Appointment {
        if (this.status !== 'IN_PROGRESS') {
            throw new AppError('Only appointments in progress can be completed', 400);
        }

        return new Appointment(
            this.id,
            this.clientId,
            this.serviceId,
            this.establishmentId,
            this.employeeId,
            this.scheduledAt,
            'COMPLETED',
            this.notes,
            this.createdAt,
            new Date()
        );
    }

    isScheduledFor(date: Date): boolean {
        return this.scheduledAt.toDateString() === date.toDateString();
    }
}
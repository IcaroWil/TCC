import { PrismaClient } from '@prisma/client';
import { IAppointmentRepository } from "../../../domain/repositories/IAppointmentRepository";
import { Appointment, AppointmentStatus } from '../../../domain/entities/Appointment';

export class PrismaAppointmentRepository implements IAppointmentRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(appointment: Appointment): Promise<Appointment> {
        const created = await this.prisma.appointment.create({
            data: {
                id: appointment.id,
                clientId: appointment.clientId,
                serviceId: appointment.serviceId,
                establishmentId: appointment.establishmentId,
                employeeId: appointment.employeeId,
                scheduledAt: appointment.scheduledAt,
                status: appointment.status,
                notes: appointment.notes,
              },
        });

        return new Appointment(
            created.id,
            created.clientId,
            created.serviceId,
            created.establishmentId,
            created.employeeId,
            created.scheduledAt,
            created.status as AppointmentStatus,
            created.notes || undefined,
            created.createdAt,
            created.updatedAt
        );
    }

    async findById(id: string): Promise<Appointment | null> {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
        });

        if (!appointment) return null;

        return new Appointment(
            appointment.id,
            appointment.clientId,
            appointment.serviceId,
            appointment.establishmentId,
            appointment.employeeId,
            appointment.scheduledAt,
            appointment.status as AppointmentStatus,
            appointment.notes || undefined,
            appointment.createdAt,
            appointment.updatedAt
        );
    }

    async findByClient(clientId: string): Promise<Appointment[]> {
        const appointments = await this.prisma.appointment.findMany({
            where: { clientId },
            orderBy: { scheduledAt: 'desc' },
        });

        return appointments.map((appointment: any) => new Appointment(
            appointment.id,
            appointment.clientId,
            appointment.serviceId,
            appointment.establishmentId,
            appointment.employeeId,
            appointment.scheduledAt,
            appointment.status as AppointmentStatus,
            appointment.notes || undefined,
            appointment.createdAt,
            appointment.updatedAt
        ));
    }

    async findConflicts(employeeId: string, scheduledAt: Date, duration: number): Promise<Appointment[]> {
        if (!scheduledAt || isNaN(scheduledAt.getTime())) {
            console.error('Invalid scheduledAt date:', scheduledAt);
            return [];
        }

        const endTime = new Date(scheduledAt.getTime() + duration * 60000);
        
        if (isNaN(endTime.getTime())) {
            console.error('Invalid endTime calculated:', endTime);
            return [];
        }

        const appointments = await this.prisma.appointment.findMany({
            where: {
                employeeId,
                status: {
                    notIn: ['CANCELLED', 'COMPLETED'],
                },
                OR: [
                    {
                        scheduledAt: {
                            lte: endTime,
                        },
                    },
                    {
                        scheduledAt: {
                            gte: scheduledAt,
                            lt: endTime,
                        },
                    },
                ],
            },
        });

        return appointments.map((appointment: any) => new Appointment(
            appointment.id,
            appointment.clientId,
            appointment.serviceId,
            appointment.establishmentId,
            appointment.employeeId,
            appointment.scheduledAt,
            appointment.status as AppointmentStatus,
            appointment.notes || undefined,
            appointment.createdAt,
            appointment.updatedAt
        ));
    }

    async findByEmployee(employeeId: string): Promise<Appointment[]> {
        throw new Error('Method not implemented');
    }

    async findByEstablishment(establishmentId: string): Promise<Appointment[]> {
        throw new Error('Method not implemented.');
    }

    async findByDateRange(establishmentId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
        throw new Error('Method not implemented');
    }

    async findByStatus(establishmentId: string, status: AppointmentStatus): Promise<Appointment[]> {
        throw new Error('Method not implemented.');
    }

    async update(appointment: Appointment): Promise<Appointment> {
        throw new Error('Method not implemented.');
    }
    
    async delete(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    
    async list(page: number, limit: number): Promise<{appointments: Appointment[], total: number}> {
        throw new Error('Method not implemented.');
    }
}
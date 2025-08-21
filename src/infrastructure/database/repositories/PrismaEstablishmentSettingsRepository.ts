import { PrismaClient } from '@prisma/client';
import { EstablishmentSettings } from '../../../domain/entities/EstablishmentSettings';
import { IEstablishmentSettingsRepository } from '../../../domain/repositories/IEstablishmentSettingsRepository';

export class PrismaEstablishmentSettingsRepository implements IEstablishmentSettingsRepository {
    constructor(private prisma: PrismaClient) {}

    async findByEstablishmentId(establishmentId: string): Promise<EstablishmentSettings | null> {
        const settings = await this.prisma.establishmentSettings.findUnique({
            where: { establishmentId }
        });

        return settings ? this.toDomain(settings) : null;
    }

    async create(settings: EstablishmentSettings): Promise<EstablishmentSettings> {
        const created = await this.prisma.establishmentSettings.create({
            data: {
                id: settings.id,
                establishmentId: settings.establishmentId,
                workingHours: settings.workingHours as any,
                appointmentSettings: settings.appointmentSettings as any,
                paymentSettings: settings.paymentSettings as any,
                notificationSettings: settings.notificationSettings as any,
                customFields: settings.customFields as any,
                integrations: settings.integrations as any,
                createdAt: settings.createdAt,
                updatedAt: settings.updatedAt
            }
        });

        return this.toDomain(created);
    }

    async update(settings: EstablishmentSettings): Promise<EstablishmentSettings> {
        const updated = await this.prisma.establishmentSettings.update({
            where: { establishmentId: settings.establishmentId },
            data: {
                workingHours: settings.workingHours as any,
                appointmentSettings: settings.appointmentSettings as any,
                paymentSettings: settings.paymentSettings as any,
                notificationSettings: settings.notificationSettings as any,
                customFields: settings.customFields as any,
                integrations: settings.integrations as any,
                updatedAt: settings.updatedAt
            }
        });

        return this.toDomain(updated);
    }

    async delete(establishmentId: string): Promise<void> {
        await this.prisma.establishmentSettings.delete({
            where: { establishmentId }
        });
    }

    private toDomain(data: any): EstablishmentSettings {
        return new EstablishmentSettings(
            data.id,
            data.establishmentId,
            data.workingHours,
            data.appointmentSettings,
            data.paymentSettings,
            data.notificationSettings,
            data.customFields,
            data.integrations,
            data.createdAt,
            data.updatedAt
        );
    }
}
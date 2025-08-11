import { PrismaClient } from '@prisma/client';
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { Service } from '../../../domain/entities/Service';

export class PrismaServiceRepository implements IServiceRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(service: Service): Promise<Service> {
        const created = await this.prisma.service.create({
            data: {
                id: service.id,
                name: service.name,
                description: service.description,
                duration: service.duration,
                price: service.price,
                establishmentId: service.establishmentId,
                isActive: service.isActive,
            },
        });

        return new Service(
            created.id,
            created.name,
            created.description,
            created.duration,
            created.price.toNumber(),
            created.establishmentId,
            created.isActive,
            created.createdAt,
            created.updatedAt
        );
    }

    async findById(id: string): Promise<Service | null> {
        const service = await this.prisma.service.findUnique({
            where: { id },
        });

        if (!service) return null;

        return new Service(
            service.id,
            service.name,
            service.description,
            service.duration,
            service.price.toNumber(),
            service.establishmentId,
            service.isActive,
            service.createdAt,
            service.updatedAt
        );
    }

    async findByEstablishment(establishmentId: string): Promise<Service[]> {
        const services = await this.prisma.service.findMany({
            where: { establishmentId },
            orderBy: { name: 'asc' },
        });

        return services.map(service => new Service(
            service.id,
            service.name,
            service.description,
            service.duration,
            service.price.toNumber(),
            service.establishmentId,
            service.isActive,
            service.createdAt,
            service.updatedAt
        ));
    }

    async findActiveByEstablishment(establishmentId: string): Promise<Service[]> {
        const services = await this.prisma.service.findMany({
            where: {
                establishmentId,
                isActive: true
            },
            orderBy: { name: 'asc' },
        });

        return services.map(service => new Service(
            service.id,
            service.name,
            service.description,
            service.duration,
            service.price.toNumber(),
            service.establishmentId,
            service.isActive,
            service.createdAt,
            service.updatedAt
        ));
    }

    async update(service: Service): Promise<Service> {
        const updated = await this.prisma.service.update({
            where: { id: service.id },
            data: {
                name: service.name,
                description: service.description,
                duration: service.duration,
                price: service.price,
                isActive: service.isActive,
            },
        });

        return new Service(
            updated.id,
            updated.name,
            updated.description,
            updated.duration,
            updated.price.toNumber(),
            updated.establishmentId,
            updated.isActive,
            updated.createdAt,
            updated.updatedAt
        );
    }

    async delete(id: string): Promise<void> {
        await this.prisma.service.delete({
            where: { id },
        });
    }

    async list(page: number, limit: number): Promise<{services: Service[], total: number}> {
        const [services, total] = await Promise.all([
            this.prisma.service.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.service.count(),
        ]);

        return {
            services: services.map(service => new Service(
                service.id,
                service.name,
                service.description,
                service.duration,
                service.price.toNumber(),
                service.establishmentId,
                service.isActive,
                service.createdAt,
                service.updatedAt
            )),
            total,
        };
    }
}
import { PrismaClient } from '@prisma/client';
import { IEstablishmentRepository } from "../../../domain/repositories/IEstablishmentRepository";
import { Establishment } from '../../../domain/entities/Establishment';

export class PrismaEstablishmentRepository implements IEstablishmentRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(establishment: Establishment): Promise<Establishment> {
        const created = await this.prisma.establishment.create({
            data: {
                id: establishment.id,
                name: establishment.name,
                email: establishment.email,
                phone: establishment.phone,
                address: establishment.address,
                city: establishment.city,
                state: establishment.state,
                zipCode: establishment.zipCode,
                cnpj: establishment.cnpj,
                isActive: establishment.isActive,
            },
        });

        return new Establishment(
            created.id,
            created.name,
            created.email,
            created.phone,
            created.address,
            created.city,
            created.state,
            created.zipCode,
            created.cnpj,
            created.isActive,
            created.createdAt,
            created.updatedAt
        );
    }

    async findById(id: string): Promise<Establishment | null> {
        const establishment = await this.prisma.establishment.findUnique({
            where: { id },
        });

        if (!establishment) return null;

        return new Establishment(
            establishment.id,
            establishment.name,
            establishment.email,
            establishment.phone,
            establishment.address,
            establishment.city,
            establishment.state,
            establishment.zipCode,
            establishment.cnpj,
            establishment.isActive,
            establishment.createdAt,
            establishment.updatedAt
        );
    }

    async findByEmail(email: string): Promise<Establishment | null> {
        const establishment = await this.prisma.establishment.findUnique({
            where: { email },
        });

        if (!establishment) return null;

        return new Establishment(
            establishment.id,
            establishment.name,
            establishment.email,
            establishment.phone,
            establishment.address,
            establishment.city,
            establishment.state,
            establishment.zipCode,
            establishment.cnpj,
            establishment.isActive,
            establishment.createdAt,
            establishment.updatedAt
        );
    }

    async findByCnpj(cnpj: string): Promise<Establishment | null> {
        const establishment = await this.prisma.establishment.findUnique({
            where: { cnpj },
        });

        if (!establishment) return null;

        return new Establishment(
            establishment.id,
            establishment.name,
            establishment.email,
            establishment.phone,
            establishment.address,
            establishment.city,
            establishment.state,
            establishment.zipCode,
            establishment.cnpj,
            establishment.isActive,
            establishment.createdAt,
            establishment.updatedAt
        );
    }

    async update(establishment: Establishment): Promise<Establishment> {
        const updated = await this.prisma.establishment.update({
            where: { id: establishment.id },
            data: {
                name: establishment.name,
                email: establishment.email,
                phone: establishment.phone,
                address: establishment.address,
                city: establishment.city,
                state: establishment.state,
                zipCode: establishment.zipCode,
                cnpj: establishment.cnpj,
                isActive: establishment.isActive,
            },
        });

        return new Establishment(
            updated.id,
            updated.name,
            updated.email,
            updated.phone,
            updated.address,
            updated.city,
            updated.state,
            updated.zipCode,
            updated.cnpj,
            updated.isActive,
            updated.createdAt,
            updated.updatedAt
        );
    }

    async delete(id: string): Promise<void> {
        await this.prisma.establishment.delete({
            where: { id },
        });
    }

    async list(page: number, limit: number): Promise<{establishment: Establishment[], total: number}> {
        const [establishments, total] = await Promise.all([
            this.prisma.establishment.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.establishment.count(),
        ]);

        return {
            establishment: establishments.map((establishment: any) => new Establishment(
                establishment.id,
                establishment.name,
                establishment.email,
                establishment.phone,
                establishment.address,
                establishment.city,
                establishment.state,
                establishment.zipCode,
                establishment.cnpj,
                establishment.isActive,
                establishment.createdAt,
                establishment.updatedAt
            )),
            total,
        };
    }

    async findActive(): Promise<Establishment[]> {
        const establishments = await this.prisma.establishment.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });

        return establishments.map((establishment: any) => new Establishment(
            establishment.id,
            establishment.name,
            establishment.email,
            establishment.phone,
            establishment.address,
            establishment.city,
            establishment.state,
            establishment.zipCode,
            establishment.cnpj,
            establishment.isActive,
            establishment.createdAt,
            establishment.updatedAt
        ));
    }
}
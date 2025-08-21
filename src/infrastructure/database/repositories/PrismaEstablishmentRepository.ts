import { PrismaClient } from '@prisma/client';
import { IEstablishmentRepository } from "../../../domain/repositories/IEstablishmentRepository";
import { Establishment } from '../../../domain/entities/Establishment';
import { BusinessCategoryType } from '../../../domain/entities/BusinessCategory';
import { SocialMediaLinks } from '../../../domain/value-objects/SocialMediaLinks';

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
                businessCategoryId: establishment.businessCategoryId,
                subcategory: establishment.subcategory,
                businessType: establishment.businessType,
                document: establishment.document,
                description: establishment.description,
                website: establishment.website,
                socialMedia: establishment.socialMedia?.toJSON(),
                isActive: establishment.isActive,
            },
        });

        return this.toDomain(created);
    }

    async findById(id: string): Promise<Establishment | null> {
        const establishment = await this.prisma.establishment.findUnique({
            where: { id },
            include: { businessCategory: true }
        });

        return establishment ? this.toDomain(establishment) : null;
    }

    async findByEmail(email: string): Promise<Establishment | null> {
        const establishment = await this.prisma.establishment.findUnique({
            where: { email },
            include: { businessCategory: true }
        });

        return establishment ? this.toDomain(establishment) : null;
    }

    async findByCnpj(cnpj: string): Promise<Establishment | null> {
        const establishment = await this.prisma.establishment.findFirst({
            where: { document: cnpj },
            include: { businessCategory: true }
        });

        return establishment ? this.toDomain(establishment) : null;
    }

    async findByDocument(document: string): Promise<Establishment | null> {
        const establishment = await this.prisma.establishment.findUnique({
            where: { document },
            include: { businessCategory: true }
        });

        return establishment ? this.toDomain(establishment) : null;
    }

    async findByCategory(categoryId: string): Promise<Establishment[]> {
        const establishments = await this.prisma.establishment.findMany({
            where: { businessCategoryId: categoryId },
            include: { businessCategory: true },
            orderBy: { name: 'asc' }
        });

        return establishments.map(this.toDomain);
    }

    async findByCategoryType(categoryType: BusinessCategoryType): Promise<Establishment[]> {
        const establishments = await this.prisma.establishment.findMany({
            where: {
                businessCategory: {
                    type: categoryType
                }
            },
            include: { businessCategory: true },
            orderBy: { name: 'asc' }
        });

        return establishments.map(this.toDomain);
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
                businessCategoryId: establishment.businessCategoryId,
                subcategory: establishment.subcategory,
                businessType: establishment.businessType,
                document: establishment.document,
                description: establishment.description,
                website: establishment.website,
                socialMedia: establishment.socialMedia?.toJSON(),
                isActive: establishment.isActive,
            },
            include: { businessCategory: true }
        });

        return this.toDomain(updated);
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
                include: { businessCategory: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.establishment.count(),
        ]);

        return {
            establishment: establishments.map(this.toDomain),
            total,
        };
    }

    async findActive(): Promise<Establishment[]> {
        const establishments = await this.prisma.establishment.findMany({
            where: { isActive: true },
            include: { businessCategory: true },
            orderBy: { name: 'asc' },
        });

        return establishments.map(this.toDomain);
    }

    private toDomain(data: any): Establishment {
        const socialMedia = data.socialMedia ? 
            SocialMediaLinks.fromJSON(data.socialMedia) : 
            undefined;

        return new Establishment(
            data.id,
            data.name,
            data.email,
            data.phone,
            data.address,
            data.city,
            data.state,
            data.zipCode,
            data.businessCategoryId,
            data.subcategory,
            data.businessType,
            data.document,
            data.description,
            data.website,
            socialMedia,
            data.isActive,
            data.createdAt,
            data.updatedAt
        );
    }
}
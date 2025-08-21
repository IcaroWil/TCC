import { PrismaClient } from '@prisma/client';
import { BusinessCategory, BusinessCategoryType } from '../../../domain/entities/BusinessCategory';
import { IBusinessCategoryRepository } from '../../../domain/repositories/IBusinessCategoryRepository';

export class PrismaBusinessCategoryRepository implements IBusinessCategoryRepository {
    constructor(private prisma: PrismaClient) {}

    async findAll(): Promise<BusinessCategory[]> {
        const categories = await this.prisma.businessCategory.findMany({
            orderBy: { name: 'asc' }
        });

        return categories.map(this.toDomain);
    }

    async findById(id: string): Promise<BusinessCategory | null> {
        const category = await this.prisma.businessCategory.findUnique({
            where: { id }
        });

        return category ? this.toDomain(category) : null;
    }

    async findByType(type: BusinessCategoryType): Promise<BusinessCategory[]> {
        const categories = await this.prisma.businessCategory.findMany({
            where: { type },
            orderBy: { name: 'asc' }
        });

        return categories.map(this.toDomain);
    }

    async findActiveCategories(): Promise<BusinessCategory[]> {
        const categories = await this.prisma.businessCategory.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        });

        return categories.map(this.toDomain);
    }

    async create(category: BusinessCategory): Promise<BusinessCategory> {
        const created = await this.prisma.businessCategory.create({
            data: {
                id: category.id,
                name: category.name,
                type: category.type,
                description: category.description,
                subcategories: category.subcategories,
                defaultSettings: category.defaultSettings as any,
                isActive: category.isActive,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt
            }
        });

        return this.toDomain(created);
    }

    async update(category: BusinessCategory): Promise<BusinessCategory> {
        const updated = await this.prisma.businessCategory.update({
            where: { id: category.id },
            data: {
                name: category.name,
                type: category.type,
                description: category.description,
                subcategories: category.subcategories,
                defaultSettings: category.defaultSettings as any,
                isActive: category.isActive,
                updatedAt: category.updatedAt
            }
        });

        return this.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.businessCategory.delete({
            where: { id }
        });
    }

    private toDomain(data: any): BusinessCategory {
        return new BusinessCategory(
            data.id,
            data.name,
            data.type as BusinessCategoryType,
            data.description,
            data.subcategories,
            data.defaultSettings,
            data.isActive,
            data.createdAt,
            data.updatedAt
        );
    }
}
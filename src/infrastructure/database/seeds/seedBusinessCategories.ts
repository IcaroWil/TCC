import { PrismaClient } from '@prisma/client';
import { defaultBusinessCategories } from './businessCategories';

const prisma = new PrismaClient();

async function seedBusinessCategories() {
    console.log('🌱 Seeding business categories...');

    try {
        for (const category of defaultBusinessCategories) {
            const existing = await prisma.businessCategory.findUnique({
                where: { id: category.id }
            });

            if (!existing) {
                await prisma.businessCategory.create({
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
                console.log(`✅ Created category: ${category.name}`);
            } else {
                console.log(`⏭️  Category already exists: ${category.name}`);
            }
        }

        console.log('🎉 Business categories seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding business categories:', error);
        throw error;
    }
}

async function main() {
    await seedBusinessCategories();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
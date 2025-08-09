import { PrismaClient } from '@prisma/client';
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from '../../../domain/entities/User';

export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(user: User): Promise<User> {
        const created = await this.prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role,
                establishmentId: user.establihmentId,
                password: '',
            },
        });

        return new User(      
            created.id,
            created.email,
            created.name,
            created.phone,
            created.role as 'CLIENT' | 'ADMIN' | 'EMPLOYEE',
            created.establishmentId || undefined,
            created.createdAt,
            created.updatedAt
        );
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) return null;

        return new User(
            user.id,
            user.email,
            user.name,
            user.phone,
            user.role as 'CLIENT' | 'ADMIN' | 'EMPLOYEE',
            user.establihmentId || undefined,
            user.createdAt,
            user.updatedAt
        );
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) return null;

        return new User(
            user.id,
            user.email,
            user.name,
            user.phone,
            user.role as 'CLIENT' | 'ADMIN' | 'EMPLOYEE',
            user.establihmentId || undefined,
            user.createdAt,
            user.updatedAt
        );
    }

    
}
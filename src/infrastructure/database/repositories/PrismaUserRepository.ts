import { PrismaClient } from '@prisma/client';
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from '../../../domain/entities/User';

export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(user: User, hashedPassword: string): Promise<User> {
        const created = await this.prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role,
                establishmentId: user.establishmentId,
                password: hashedPassword,
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
            user.establishmentId || undefined,
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
            user.establishmentId || undefined,
            user.createdAt,
            user.updatedAt
        );
    }

    async findByEstablishment(establishmentId: string): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            where: { establishmentId },
        });

        return users.map((user: any) => new User(
            user.id,
            user.email,
            user.name,
            user.phone,
            user.role as 'CLIENT' | 'ADMIN' | 'EMPLOYEE',
            user.establishmentId || undefined,
            user.createdAt,
            user.updatedAt
        ));
    }

    async update(user: User): Promise<User> {
        const updated = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                name: user.name,
                phone: user.phone,
                role: user.role,
                establishmentId: user.establishmentId,
            },
        });

        return new User(
            updated.id,
            updated.email,
            updated.name,
            updated.phone,
            updated.role as 'CLIENT' | 'ADMIN' | 'EMPLOYEE',
            updated.establishmentId || undefined,
            updated.createdAt,
            updated.updatedAt
        );
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({
            where: { id },
        });
    }

    async list(page: number, limit: number): Promise<{users: User[], total: number}> {
        const [users, total] = await Promise.all([
          this.prisma.user.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
          }),
          this.prisma.user.count(),
        ]);

        return {
            users: users.map((user: any) => new User(
              user.id,
              user.email,
              user.name,
              user.phone,
              user.role as 'CLIENT' | 'ADMIN' | 'EMPLOYEE',
              user.establishmentId || undefined,
              user.createdAt,
              user.updatedAt
            )),
            total,
        };
    }

    async findByEmailWithPassword(email: string): Promise<(User & { password: string }) | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) return null;

        const userEntity = new User(
            user.id,
            user.email,
            user.name,
            user.phone,
            user.role as 'CLIENT' | 'ADMIN' | 'EMPLOYEE',
            user.establishmentId || undefined,
            user.createdAt,
            user.updatedAt
        );

        return Object.assign(userEntity, { password: user.password });
    }
    
}
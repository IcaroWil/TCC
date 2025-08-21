import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { PrismaUserRepository } from '../database/repositories/PrismaUserRepository';

export class UserRepository implements IUserRepository {
  private prismaUserRepository: PrismaUserRepository;

  constructor() {
    const prisma = new PrismaClient();
    this.prismaUserRepository = new PrismaUserRepository(prisma);
  }

  async create(user: User, hashedPassword: string): Promise<User> {
    return await this.prismaUserRepository.create(user, hashedPassword);
  }

  async findById(id: string): Promise<User | null> {
    return await this.prismaUserRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prismaUserRepository.findByEmail(email);
  }

  async findByEmailWithPassword(email: string): Promise<(User & { password: string }) | null> {
    return await this.prismaUserRepository.findByEmailWithPassword(email);
  }

  async findByEstablishment(establishmentId: string): Promise<User[]> {
    return await this.prismaUserRepository.findByEstablishment(establishmentId);
  }

  async update(user: User): Promise<User> {
    return await this.prismaUserRepository.update(user);
  }

  async delete(id: string): Promise<void> {
    return await this.prismaUserRepository.delete(id);
  }

  async list(page: number, limit: number): Promise<{users: User[], total: number}> {
    return await this.prismaUserRepository.list(page, limit);
  }
}
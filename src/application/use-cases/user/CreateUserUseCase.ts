import { IUseCase } from '../../interfaces/IUseCase';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { CreateUserDTO } from '../../dtos/CreateUserDTO';
import { AppError } from '../../../shared/errors/AppError';

export interface IHashService {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

export class CreateUserUseCase implements IUseCase<CreateUserDTO, User> {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService
  ) {}

  async execute(data: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email já está em uso', 400);
    }

    if (!['ADMIN', 'EMPLOYEE', 'CLIENT'].includes(data.role)) {
      throw new AppError('Role inválido', 400);
    }

    if (data.role === 'EMPLOYEE' && !data.establishmentId) {
      throw new AppError('EstablishmentId é obrigatório para funcionários', 400);
    }

    const hashedPassword = await this.hashService.hash(data.password);

    const user = User.create({
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role,
      establishmentId: data.establishmentId
    });

    return await this.userRepository.create(user, hashedPassword);
  }
}
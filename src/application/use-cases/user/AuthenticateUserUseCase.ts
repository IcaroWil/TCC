import { IUseCase } from '../../interfaces/IUseCase';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { AppError } from '../../../shared/errors/AppError';
import { IHashService } from './CreateUserUseCase';

export interface ITokenService {
  generateToken(payload: { userId: string; email: string; role: string }): string;
  verifyToken(token: string): { userId: string; email: string; role: string };
}

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}

export interface AuthenticateUserResponse {
  user: User;
  token: string;
}

export class AuthenticateUserUseCase implements IUseCase<AuthenticateUserDTO, AuthenticateUserResponse> {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private tokenService: ITokenService
  ) {}

  async execute(data: AuthenticateUserDTO): Promise<AuthenticateUserResponse> {
    const userWithPassword = await this.userRepository.findByEmailWithPassword(data.email);
    
    if (!userWithPassword) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const isPasswordValid = await this.hashService.compare(data.password, userWithPassword.password);
    
    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const user = new User(
      userWithPassword.id,
      userWithPassword.email,
      userWithPassword.name,
      userWithPassword.phone,
      userWithPassword.role,
      userWithPassword.establishmentId,
      userWithPassword.createdAt,
      userWithPassword.updatedAt
    );

    const token = this.tokenService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return {
      user,
      token
    };
  }
}
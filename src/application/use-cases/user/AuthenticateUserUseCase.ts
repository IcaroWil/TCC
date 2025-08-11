import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IAuthService } from "../../../domain/services/IAuthService";
import { AppError } from "../../../shared/errors/AppError";
import { AuthenticateUserDTO, AuthenticateUserResponseDTO } from "../../dtos/CreateUserDTO";
import { IUseCase } from "../../interfaces/IUseCase";

export class AuthenticateUserUseCase implements IUseCase<AuthenticateUserDTO, AuthenticateUserResponseDTO> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authService: IAuthService
    ) {}

    async execute(request: AuthenticateUserDTO): Promise<AuthenticateUserResponseDTO> {
        const userWithPassword = await this.userRepository.findByEmailWithPassword(request.email);
        if (!userWithPassword) {
            throw new AppError('Invalid credentials', 401);
        }

        const isValidPassword = await this.authService.comparePassword(request.password, userWithPassword.password);
        if (!isValidPassword) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = await this.authService.generateToken(userWithPassword.id);

        return {
            user: {
                id: userWithPassword.id,
                email: userWithPassword.email,
                name: userWithPassword.name,
                role: userWithPassword.role
            },
            token
        };
    }
}
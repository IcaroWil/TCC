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
        const user = await this.userRepository.findByEmail(request.email);
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isValidPassword = await this.authService.comparePassword(request.password, user.password);
        if (!isValidPassword) { 
            throw new AppError('Invalid credentials', 401);
        }

        const token = await this.authService.generateToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        };
    }
}
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IAuthService } from "../../../domain/services/IAuthService";
import { CreateUserDTO } from "../../dtos/CreateUserDTO";
import { IUseCase } from "../../interfaces/IUseCase";

export class CreateUserUseCase implements IUseCase<CreateUserDTO, User> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authService: IAuthService
    ) {}

    async execute(request: CreateUserDTO): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new AppError('Email already exists', 400);
        }

        const hashedPassword = await this.authService.hashPassword(request.password);

        const user = User.create({
            email: request.email,
            name: request.name,
            phone: request.phone,
            role: request.role,
            establishmentId: request.establishmentId
        });

        const savedUser = await this.userRepository.create(user);

        return savedUser
    }
}
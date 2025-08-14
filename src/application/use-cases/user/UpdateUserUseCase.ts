import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { IUseCase } from "../../interfaces/IUseCase";

interface UpdateUserRequest {
    id: string;
    name?: string;
    phone?: string;
    role?: 'CLIENT' | 'ADMIN' | 'EMPLOYEE';
    establishmentId?: string;
}

export class UpdateUserUseCase implements IUseCase<UpdateUserRequest, User> {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(request: UpdateUserRequest): Promise<User> {
        const existingUser = await this.userRepository.findById(request.id);
        
        if (!existingUser) {
            throw new AppError('User not found', 404);
        }

        const updatedUser = new User(
            existingUser.id,
            existingUser.email, // Email não pode ser alterado
            request.name ?? existingUser.name,
            request.phone ?? existingUser.phone,
            request.role ?? existingUser.role,
            request.establishmentId !== undefined ? request.establishmentId : existingUser.establishmentId,
            existingUser.createdAt,
            new Date() // updatedAt
        );

        return await this.userRepository.update(updatedUser);
    }
}
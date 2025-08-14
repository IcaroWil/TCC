import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { IUseCase } from "../../interfaces/IUseCase";

export class DeleteUserUseCase implements IUseCase<string, void> {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(id: string): Promise<void> {
        const existingUser = await this.userRepository.findById(id);
        
        if (!existingUser) {
            throw new AppError('User not found', 404);
        }

        if (existingUser.role === 'ADMIN') {
        }

        await this.userRepository.delete(id);
    }
}
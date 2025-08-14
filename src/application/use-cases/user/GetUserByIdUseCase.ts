import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { IUseCase } from "../../interfaces/IUseCase";

export class GetUserByIdUseCase implements IUseCase<string, User> {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        
        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }
}
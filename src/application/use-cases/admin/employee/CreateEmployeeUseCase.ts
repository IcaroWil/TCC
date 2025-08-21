import { User } from "../../../../domain/entities/User";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { IAuthService } from "../../../../domain/services/IAuthService";
import { AppError } from "../../../../shared/errors/AppError";
import { IUseCase } from "../../../interfaces/IUseCase";

interface CreateEmployeeRequest {
    email: string;
    name: string;
    phone: string;
    password: string;
    establishmentId: string;
}

export class CreateEmployeeUseCase implements IUseCase<CreateEmployeeRequest, User> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authService: IAuthService
    ) {}

    async execute(request: CreateEmployeeRequest): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new AppError('Email already exists', 400);
        }

        const hashedPassword = await this.authService.hashPassword(request.password);

        const employee = User.create({
            email: request.email,
            name: request.name,
            phone: request.phone,
            role: 'EMPLOYEE',
            establishmentId: request.establishmentId
        });

        const savedEmployee = await this.userRepository.create(employee, hashedPassword);

        return savedEmployee;
    }
}
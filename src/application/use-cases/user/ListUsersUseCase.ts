import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IUseCase } from "../../interfaces/IUseCase";

interface ListUsersRequest {
    page: number;
    limit: number;
}

interface ListUsersResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class ListUsersUseCase implements IUseCase<ListUsersRequest, ListUsersResponse> {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(request: ListUsersRequest): Promise<ListUsersResponse> {
        const { page, limit } = request;
        
        if (page < 1 || limit < 1 || limit > 100) {
            throw new Error('Invalid pagination parameters');
        }

        const result = await this.userRepository.list(page, limit);
        
        const totalPages = Math.ceil(result.total / limit);

        return {
            users: result.users,
            total: result.total,
            page,
            limit,
            totalPages
        };
    }
}
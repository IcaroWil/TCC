import { IEstablishmentRepository } from "../../../domain/repositories/IEstablishmentRepository";
import { Establishment } from "../../../domain/entities/Establishment";
import { AppError } from "../../../shared/errors/AppError";

export interface ListEstablishmentsRequest {
    page?: number;
    limit?: number;
    activeOnly?: boolean;
}

export interface ListEstablishmentsResponse {
    establishments: Establishment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class ListEstablishmentsUseCase {
    constructor(
        private readonly establishmentRepository: IEstablishmentRepository
    ) {}

    async execute(request: ListEstablishmentsRequest = {}): Promise<ListEstablishmentsResponse> {
        const page = Math.max(1, request.page || 1);
        const limit = Math.min(100, Math.max(1, request.limit || 10));

        try {
            if (request.activeOnly) {
                const establishments = await this.establishmentRepository.findActive();
                const total = establishments.length;
                
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedEstablishments = establishments.slice(startIndex, endIndex);
                
                const totalPages = Math.ceil(total / limit);

                return {
                    establishments: paginatedEstablishments,
                    total,
                    page,
                    limit,
                    totalPages
                };
            } else {
                const result = await this.establishmentRepository.list(page, limit);
                const totalPages = Math.ceil(result.total / limit);

                return {
                    establishments: result.establishment,
                    total: result.total,
                    page,
                    limit,
                    totalPages
                };
            }
        } catch (error: any) {
            throw new AppError("Failed to list establishments", 500);
        }
    }
}
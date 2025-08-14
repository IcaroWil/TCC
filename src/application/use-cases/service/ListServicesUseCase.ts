import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { Service } from "../../../domain/entities/Service";
import { AppError } from "../../../shared/errors/AppError";

export interface ListServicesRequest {
    page?: number;
    limit?: number;
    establishmentId?: string;
    activeOnly?: boolean;
}

export interface ListServicesResponse {
    services: Service[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class ListServicesUseCase {
    constructor(
        private readonly serviceRepository: IServiceRepository
    ) {}

    async execute(request: ListServicesRequest = {}): Promise<ListServicesResponse> {
        const page = Math.max(1, request.page || 1);
        const limit = Math.min(100, Math.max(1, request.limit || 10));

        let services: Service[];
        let total: number;

        try {
            if (request.establishmentId) {
                if (request.activeOnly) {
                    services = await this.serviceRepository.findActiveByEstablishment(request.establishmentId);
                    total = services.length;
                } else {
                    services = await this.serviceRepository.findByEstablishment(request.establishmentId);
                    total = services.length;
                }
                
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                services = services.slice(startIndex, endIndex);
            } else {
                const result = await this.serviceRepository.list(page, limit);
                services = result.services;
                total = result.total;
            }

            const totalPages = Math.ceil(total / limit);

            return {
                services,
                total,
                page,
                limit,
                totalPages
            };
        } catch (error: any) {
            throw new AppError("Failed to list services", 500);
        }
    }
}
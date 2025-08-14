import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { Service } from "../../../domain/entities/Service";
import { AppError } from "../../../shared/errors/AppError";

export interface UpdateServiceRequest {
    id: string;
    name?: string;
    description?: string;
    duration?: number;
    price?: number;
    isActive?: boolean;
}

export class UpdateServiceUseCase {
    constructor(
        private readonly serviceRepository: IServiceRepository
    ) {}

    async execute(request: UpdateServiceRequest): Promise<Service> {
        if (!request.id || request.id.trim() === '') {
            throw new AppError("Service ID is required", 400);
        }

        const existingService = await this.serviceRepository.findById(request.id);
        if (!existingService) {
            throw new AppError("Service not found", 404);
        }

        if (request.duration !== undefined && request.duration <= 0) {
            throw new AppError("Duration must be greater than 0", 400);
        }

        if (request.price !== undefined && request.price <= 0) {
            throw new AppError("Price must be greater than 0", 400);
        }

        if (request.name !== undefined && request.name.trim().length < 2) {
            throw new AppError("Service name must have at least 2 characters", 400);
        }

        const updatedService = new Service(
            existingService.id,
            request.name !== undefined ? request.name.trim() : existingService.name,
            request.description !== undefined ? request.description.trim() : existingService.description,
            request.duration !== undefined ? request.duration : existingService.duration,
            request.price !== undefined ? request.price : existingService.price,
            existingService.establishmentId,
            request.isActive !== undefined ? request.isActive : existingService.isActive,
            existingService.createdAt,
            new Date()
        );

        try {
            return await this.serviceRepository.update(updatedService);
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new AppError("A service with this name already exists in this establishment", 409);
            }
            throw new AppError("Failed to update service", 500);
        }
    }
}
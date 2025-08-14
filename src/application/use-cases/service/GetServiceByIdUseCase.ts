import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { Service } from "../../../domain/entities/Service";
import { AppError } from "../../../shared/errors/AppError";

export class GetServiceByIdUseCase {
    constructor(
        private readonly serviceRepository: IServiceRepository
    ) {}

    async execute(id: string): Promise<Service> {
        if (!id || id.trim() === '') {
            throw new AppError("Service ID is required", 400);
        }

        const service = await this.serviceRepository.findById(id);
        
        if (!service) {
            throw new AppError("Service not found", 404);
        }

        return service;
    }
}
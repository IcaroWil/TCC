import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { Service } from "../../../domain/entities/Service";
import { CreateServiceDTO } from "../../dtos/CreateServiceDTO";
import { AppError } from "../../../shared/errors/AppError";

export class CreateServiceUseCase {
    constructor(
        private readonly serviceRepository: IServiceRepository
    ) {}

    async execute(data: CreateServiceDTO): Promise<Service> {
        if (data.duration <= 0) {
            throw new AppError("Duration must be greater than 0", 400);
        }

        if (data.price <= 0) {
            throw new AppError("Price must be greater than 0", 400);
        }

        if (data.name.trim().length < 2) {
            throw new AppError("Service name must have at least 2 characters", 400);
        }

        const service = Service.create({
            name: data.name.trim(),
            description: data.description.trim(),
            duration: data.duration,
            price: data.price,
            establishmentId: data.establishmentId
        });

        try {
            return await this.serviceRepository.create(service);
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new AppError("A service with this name already exists in this establishment", 409);
            }
            if (error.code === 'P2003') {
                throw new AppError("Establishment not found", 404);
            }
            throw new AppError("Failed to create service", 500);
        }
    }
}
import { IServiceRepository } from "../../../domain/repositories/IServiceRepository";
import { AppError } from "../../../shared/errors/AppError";

export class DeleteServiceUseCase {
    constructor(
        private readonly serviceRepository: IServiceRepository
    ) {}

    async execute(id: string): Promise<void> {
        if (!id || id.trim() === '') {
            throw new AppError("Service ID is required", 400);
        }

        const existingService = await this.serviceRepository.findById(id);
        if (!existingService) {
            throw new AppError("Service not found", 404);
        }

        try {
            await this.serviceRepository.delete(id);
        } catch (error: any) {
            if (error.code === 'P2003') {
                throw new AppError("Cannot delete service: it has associated appointments", 409);
            }
            throw new AppError("Failed to delete service", 500);
        }
    }
}
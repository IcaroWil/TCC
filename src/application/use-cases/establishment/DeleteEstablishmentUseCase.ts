import { IEstablishmentRepository } from "../../../domain/repositories/IEstablishmentRepository";
import { AppError } from "../../../shared/errors/AppError";

export class DeleteEstablishmentUseCase {
    constructor(
        private readonly establishmentRepository: IEstablishmentRepository
    ) {}

    async execute(id: string): Promise<void> {
        if (!id || id.trim() === '') {
            throw new AppError("Establishment ID is required", 400);
        }

        const existingEstablishment = await this.establishmentRepository.findById(id);
        if (!existingEstablishment) {
            throw new AppError("Establishment not found", 404);
        }

        try {
            await this.establishmentRepository.delete(id);
        } catch (error: any) {
            if (error.code === 'P2003') {
                throw new AppError("Cannot delete establishment: it has associated data (users, services, appointments)", 409);
            }
            throw new AppError("Failed to delete establishment", 500);
        }
    }
}
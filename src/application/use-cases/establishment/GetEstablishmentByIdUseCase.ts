import { IEstablishmentRepository } from "../../../domain/repositories/IEstablishmentRepository";
import { Establishment } from "../../../domain/entities/Establishment";
import { AppError } from "../../../shared/errors/AppError";

export class GetEstablishmentByIdUseCase {
    constructor(
        private readonly establishmentRepository: IEstablishmentRepository
    ) {}

    async execute(id: string): Promise<Establishment> {
        if (!id || id.trim() === '') {
            throw new AppError("Establishment ID is required", 400);
        }

        const establishment = await this.establishmentRepository.findById(id);
        
        if (!establishment) {
            throw new AppError("Establishment not found", 404);
        }

        return establishment;
    }
}
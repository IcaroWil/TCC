import { IEstablishmentRepository } from "../../../../domain/repositories/IEstablishmentRepository";
import { Establishment } from "../../../../domain/entities/Establishment";
import { AppError } from "../../../../shared/errors/AppError";
import { IUseCase } from "../../../interfaces/IUseCase";

interface GetEstablishmentDetailsRequest {
    establishmentId: string;
    employeeId: string;
}

export class GetEstablishmentDetailsUseCase implements IUseCase<GetEstablishmentDetailsRequest, Establishment> {
    constructor(
        private readonly establishmentRepository: IEstablishmentRepository
    ) {}

    async execute(request: GetEstablishmentDetailsRequest): Promise<Establishment> {
        const establishment = await this.establishmentRepository.findById(request.establishmentId);
        if (!establishment) {
            throw new AppError("Establishment not found", 404);
        }

        return establishment;
    }
}
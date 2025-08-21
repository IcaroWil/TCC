import { IEstablishmentRepository } from "../../../../domain/repositories/IEstablishmentRepository";
import { Establishment } from "../../../../domain/entities/Establishment";
import { IUseCase } from "../../../interfaces/IUseCase";

interface ListEstablishmentsRequest {
    page?: number;
    limit?: number;
}

export class ListEstablishmentsUseCase implements IUseCase<ListEstablishmentsRequest, { establishments: Establishment[], total: number }> {
    constructor(
        private readonly establishmentRepository: IEstablishmentRepository
    ) {}

    async execute(request: ListEstablishmentsRequest): Promise<{ establishments: Establishment[], total: number }> {
        const page = request.page || 1;
        const limit = request.limit || 10;
        
        const result = await this.establishmentRepository.list(page, limit);
        
        return {
            establishments: result.establishment,
            total: result.total
        };
    }
}
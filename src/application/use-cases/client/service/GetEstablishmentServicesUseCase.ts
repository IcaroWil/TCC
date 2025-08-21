import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { Service } from "../../../../domain/entities/Service";
import { IUseCase } from "../../../interfaces/IUseCase";

interface GetEstablishmentServicesRequest {
    establishmentId: string;
}

export class GetEstablishmentServicesUseCase implements IUseCase<GetEstablishmentServicesRequest, Service[]> {
    constructor(
        private readonly serviceRepository: IServiceRepository
    ) {}

    async execute(request: GetEstablishmentServicesRequest): Promise<Service[]> {
        return await this.serviceRepository.findByEstablishment(request.establishmentId);
    }
}
import { IServiceRepository } from "../../../../domain/repositories/IServiceRepository";
import { Service } from "../../../../domain/entities/Service";
import { IUseCase } from "../../../interfaces/IUseCase";

interface ListServicesRequest {
    establishmentId: string;
    employeeId: string;
}

export class ListServicesUseCase implements IUseCase<ListServicesRequest, Service[]> {
    constructor(
        private readonly serviceRepository: IServiceRepository
    ) {}

    async execute(request: ListServicesRequest): Promise<Service[]> {
        return await this.serviceRepository.findByEstablishment(request.establishmentId);
    }
}
import { Service } from "../entities/Service";

export interface IServiceRepository {
    create(service: Service): Promise<Service>;
    findById(id: string): Promise<Service | null>;
    findByEstablishment(establishmentId: string): Promise<Service[]>;
    findActiveByEstablishment(establihmentId: string): Promise<Service[]>;
    update(service: Service): Promise<Service>;
    delete(id: string): Promise<void>;
    list(page: number, limit: number): Promise<{services: Service[], total: number}>;
}
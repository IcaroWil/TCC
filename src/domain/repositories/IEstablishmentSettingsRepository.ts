import { EstablishmentSettings } from '../entities/EstablishmentSettings';

export interface IEstablishmentSettingsRepository {
    findByEstablishmentId(establishmentId: string): Promise<EstablishmentSettings | null>;
    create(settings: EstablishmentSettings): Promise<EstablishmentSettings>;
    update(settings: EstablishmentSettings): Promise<EstablishmentSettings>;
    delete(establishmentId: string): Promise<void>;
}
import { IEstablishmentSettingsRepository } from "../../../../domain/repositories/IEstablishmentSettingsRepository";
import { EstablishmentSettings } from "../../../../domain/entities/EstablishmentSettings";
import { AppError } from "../../../../shared/errors/AppError";
import { IUseCase } from "../../../interfaces/IUseCase";

interface GetEstablishmentSettingsRequest {
    establishmentId: string;
}

export class GetEstablishmentSettingsUseCase implements IUseCase<GetEstablishmentSettingsRequest, EstablishmentSettings> {
    constructor(
        private readonly establishmentSettingsRepository: IEstablishmentSettingsRepository
    ) {}

    async execute(data: GetEstablishmentSettingsRequest): Promise<EstablishmentSettings> {
        const settings = await this.establishmentSettingsRepository.findByEstablishmentId(data.establishmentId);
        if (!settings) {
            throw new AppError("Configurações não encontradas para este estabelecimento", 404);
        }

        return settings;
    }
}
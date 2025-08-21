import { IEstablishmentSettingsRepository } from "../../../../domain/repositories/IEstablishmentSettingsRepository";
import { EstablishmentSettings, WorkingHours, AppointmentSettings, PaymentSettings, NotificationSettings } from "../../../../domain/entities/EstablishmentSettings";
import { AppError } from "../../../../shared/errors/AppError";
import { IUseCase } from "../../../interfaces/IUseCase";

interface UpdateEstablishmentSettingsRequest {
    establishmentId: string;
    workingHours?: WorkingHours[];
    appointmentSettings?: Partial<AppointmentSettings>;
    paymentSettings?: Partial<PaymentSettings>;
    notificationSettings?: Partial<NotificationSettings>;
}

export class UpdateEstablishmentSettingsUseCase implements IUseCase<UpdateEstablishmentSettingsRequest, EstablishmentSettings> {
    constructor(
        private readonly establishmentSettingsRepository: IEstablishmentSettingsRepository
    ) {}

    async execute(data: UpdateEstablishmentSettingsRequest): Promise<EstablishmentSettings> {
        const settings = await this.establishmentSettingsRepository.findByEstablishmentId(data.establishmentId);
        if (!settings) {
            throw new AppError("Configurações não encontradas", 404);
        }

        let updatedSettings = settings;

        if (data.workingHours) {
            updatedSettings = updatedSettings.updateWorkingHours(data.workingHours);
        }

        if (data.appointmentSettings) {
            const newAppointmentSettings = {
                ...settings.appointmentSettings,
                ...data.appointmentSettings
            };
            updatedSettings = updatedSettings.updateAppointmentSettings(newAppointmentSettings);
        }

        try {
            return await this.establishmentSettingsRepository.update(updatedSettings);
        } catch (error: any) {
            throw new AppError("Falha ao atualizar configurações do estabelecimento", 500);
        }
    }
}
import { IEstablishmentSettingsRepository } from "../../../../domain/repositories/IEstablishmentSettingsRepository";
import { IEstablishmentRepository } from "../../../../domain/repositories/IEstablishmentRepository";
import { EstablishmentSettings, WorkingHours, AppointmentSettings, PaymentSettings, NotificationSettings } from "../../../../domain/entities/EstablishmentSettings";
import { AppError } from "../../../../shared/errors/AppError";
import { IUseCase } from "../../../interfaces/IUseCase";

interface CreateEstablishmentSettingsRequest {
    establishmentId: string;
    workingHours?: WorkingHours[];
    appointmentSettings?: Partial<AppointmentSettings>;
    paymentSettings?: Partial<PaymentSettings>;
    notificationSettings?: Partial<NotificationSettings>;
}

export class CreateEstablishmentSettingsUseCase implements IUseCase<CreateEstablishmentSettingsRequest, EstablishmentSettings> {
    constructor(
        private readonly establishmentSettingsRepository: IEstablishmentSettingsRepository,
        private readonly establishmentRepository: IEstablishmentRepository
    ) {}

    async execute(data: CreateEstablishmentSettingsRequest): Promise<EstablishmentSettings> {
        const establishment = await this.establishmentRepository.findById(data.establishmentId);
        if (!establishment) {
            throw new AppError("Estabelecimento não encontrado", 404);
        }

        const existingSettings = await this.establishmentSettingsRepository.findByEstablishmentId(data.establishmentId);
        if (existingSettings) {
            throw new AppError("Configurações já existem para este estabelecimento", 409);
        }

        const settings = EstablishmentSettings.create({
            establishmentId: data.establishmentId,
            workingHours: data.workingHours,
            appointmentSettings: data.appointmentSettings,
            paymentSettings: data.paymentSettings,
            notificationSettings: data.notificationSettings
        });

        try {
            return await this.establishmentSettingsRepository.create(settings);
        } catch (error: any) {
            throw new AppError("Falha ao criar configurações do estabelecimento", 500);
        }
    }
}
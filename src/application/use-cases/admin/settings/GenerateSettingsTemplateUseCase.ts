import { IBusinessCategoryRepository } from "../../../../domain/repositories/IBusinessCategoryRepository";
import { EstablishmentSettings, WorkingHours, AppointmentSettings, PaymentSettings, NotificationSettings } from "../../../../domain/entities/EstablishmentSettings";
import { BusinessCategoryType } from "../../../../domain/entities/BusinessCategory";
import { AppError } from "../../../../shared/errors/AppError";
import { IUseCase } from "../../../interfaces/IUseCase";

interface GenerateSettingsTemplateRequest {
    businessCategoryId: string;
    subcategory: string;
}

interface SettingsTemplate {
    workingHours: WorkingHours[];
    appointmentSettings: AppointmentSettings;
    paymentSettings: PaymentSettings;
    notificationSettings: NotificationSettings;
    recommendedServices: string[];
}

export class GenerateSettingsTemplateUseCase implements IUseCase<GenerateSettingsTemplateRequest, SettingsTemplate> {
    constructor(
        private readonly businessCategoryRepository: IBusinessCategoryRepository
    ) {}

    async execute(data: GenerateSettingsTemplateRequest): Promise<SettingsTemplate> {
        const category = await this.businessCategoryRepository.findById(data.businessCategoryId);
        if (!category) {
            throw new AppError("Categoria de negócio não encontrada", 404);
        }

        if (!category.subcategories.includes(data.subcategory)) {
            throw new AppError("Subcategoria inválida para esta categoria", 400);
        }

        return this.generateTemplateByBusinessType(category.type, data.subcategory);
    }

    private generateTemplateByBusinessType(businessType: BusinessCategoryType, subcategory: string): SettingsTemplate {
        switch (businessType) {
            case BusinessCategoryType.BEAUTY_AESTHETICS:
                return this.generateBeautyTemplate(subcategory);
            case BusinessCategoryType.HEALTH_WELLNESS:
                return this.generateHealthTemplate(subcategory);
            case BusinessCategoryType.PROFESSIONAL_SERVICES:
                return this.generateProfessionalTemplate(subcategory);
            case BusinessCategoryType.EDUCATION_TRAINING:
                return this.generateEducationTemplate(subcategory);
            case BusinessCategoryType.OTHER:
                return this.generateGenericTemplate(subcategory);
            default:
                return this.generateGenericTemplate(subcategory);
        }
    }

    private generateBeautyTemplate(subcategory: string): SettingsTemplate {
        const baseWorkingHours = this.generateStandardWorkingHours(9, 18);
        
        let appointmentSettings: AppointmentSettings;
        let recommendedServices: string[];

        switch (subcategory) {
            case 'Salão de Beleza':
                appointmentSettings = {
                    defaultDuration: 90,
                    advanceBookingDays: 30,
                    requiresConfirmation: true,
                    allowsCancellation: true,
                    cancellationHours: 24,
                    maxParticipantsPerSlot: 1,
                    bufferTimeBetweenAppointments: 15
                };
                recommendedServices = ['Corte e Escova', 'Coloração', 'Tratamento Capilar', 'Penteado'];
                break;
            case 'Barbearia':
                appointmentSettings = {
                    defaultDuration: 45,
                    advanceBookingDays: 14,
                    requiresConfirmation: false,
                    allowsCancellation: true,
                    cancellationHours: 2,
                    maxParticipantsPerSlot: 1,
                    bufferTimeBetweenAppointments: 10
                };
                recommendedServices = ['Corte Masculino', 'Barba', 'Bigode', 'Sobrancelha'];
                break;
            default:
                appointmentSettings = this.getDefaultAppointmentSettings();
                recommendedServices = ['Serviço de Beleza'];
        }

        return {
            workingHours: baseWorkingHours,
            appointmentSettings,
            paymentSettings: {
                allowsOnlinePayment: true,
                requiresPaymentUpfront: false,
                acceptedPaymentMethods: ['cash', 'card', 'pix'],
                cancellationFeePercentage: 0
            },
            notificationSettings: {
                emailNotifications: true,
                smsNotifications: true,
                whatsappNotifications: true,
                reminderHoursBefore: [24, 2],
                notifyOnBooking: true,
                notifyOnCancellation: true
            },
            recommendedServices
        };
    }

    private generateHealthTemplate(subcategory: string): SettingsTemplate {
        const baseWorkingHours = this.generateStandardWorkingHours(8, 17);
        
        let appointmentSettings: AppointmentSettings;
        let recommendedServices: string[];

        switch (subcategory) {
            case 'Consultório Médico':
                appointmentSettings = {
                    defaultDuration: 30,
                    advanceBookingDays: 60,
                    requiresConfirmation: true,
                    allowsCancellation: true,
                    cancellationHours: 24,
                    maxParticipantsPerSlot: 1,
                    bufferTimeBetweenAppointments: 10
                };
                recommendedServices = ['Consulta Médica', 'Exame Clínico', 'Retorno'];
                break;
            case 'Clínica Odontológica':
                appointmentSettings = {
                    defaultDuration: 60,
                    advanceBookingDays: 30,
                    requiresConfirmation: true,
                    allowsCancellation: true,
                    cancellationHours: 48,
                    maxParticipantsPerSlot: 1,
                    bufferTimeBetweenAppointments: 15
                };
                recommendedServices = ['Consulta Odontológica', 'Limpeza', 'Tratamento', 'Emergência'];
                break;
            default:
                appointmentSettings = this.getDefaultAppointmentSettings();
                recommendedServices = ['Consulta'];
        }

        return {
            workingHours: baseWorkingHours,
            appointmentSettings,
            paymentSettings: {
                allowsOnlinePayment: true,
                requiresPaymentUpfront: true,
                acceptedPaymentMethods: ['cash', 'card', 'pix'],
                cancellationFeePercentage: 50
            },
            notificationSettings: {
                emailNotifications: true,
                smsNotifications: true,
                whatsappNotifications: false,
                reminderHoursBefore: [48, 24],
                notifyOnBooking: true,
                notifyOnCancellation: true
            },
            recommendedServices
        };
    }

    private generateProfessionalTemplate(subcategory: string): SettingsTemplate {
        const baseWorkingHours = this.generateStandardWorkingHours(9, 17);
        
        return {
            workingHours: baseWorkingHours,
            appointmentSettings: {
                defaultDuration: 60,
                advanceBookingDays: 30,
                requiresConfirmation: true,
                allowsCancellation: true,
                cancellationHours: 24,
                maxParticipantsPerSlot: 1,
                bufferTimeBetweenAppointments: 15
            },
            paymentSettings: {
                allowsOnlinePayment: true,
                requiresPaymentUpfront: true,
                acceptedPaymentMethods: ['cash', 'card', 'pix'],
                cancellationFeePercentage: 25
            },
            notificationSettings: {
                emailNotifications: true,
                smsNotifications: false,
                whatsappNotifications: true,
                reminderHoursBefore: [24],
                notifyOnBooking: true,
                notifyOnCancellation: true
            },
            recommendedServices: ['Consultoria', 'Atendimento Profissional']
        };
    }

    private generateEducationTemplate(subcategory: string): SettingsTemplate {
        const baseWorkingHours = this.generateStandardWorkingHours(8, 18);
        
        return {
            workingHours: baseWorkingHours,
            appointmentSettings: {
                defaultDuration: 120,
                advanceBookingDays: 60,
                requiresConfirmation: true,
                allowsCancellation: true,
                cancellationHours: 48,
                maxParticipantsPerSlot: 10,
                bufferTimeBetweenAppointments: 30
            },
            paymentSettings: {
                allowsOnlinePayment: true,
                requiresPaymentUpfront: true,
                acceptedPaymentMethods: ['cash', 'card', 'pix'],
                cancellationFeePercentage: 30
            },
            notificationSettings: {
                emailNotifications: true,
                smsNotifications: true,
                whatsappNotifications: true,
                reminderHoursBefore: [48, 24],
                notifyOnBooking: true,
                notifyOnCancellation: true
            },
            recommendedServices: ['Aula Individual', 'Curso', 'Workshop', 'Treinamento']
        };
    }

    private generateGenericTemplate(subcategory: string): SettingsTemplate {
        return {
            workingHours: this.generateStandardWorkingHours(9, 17),
            appointmentSettings: this.getDefaultAppointmentSettings(),
            paymentSettings: {
                allowsOnlinePayment: false,
                requiresPaymentUpfront: false,
                acceptedPaymentMethods: ['cash'],
                cancellationFeePercentage: 0
            },
            notificationSettings: {
                emailNotifications: true,
                smsNotifications: false,
                whatsappNotifications: false,
                reminderHoursBefore: [24],
                notifyOnBooking: true,
                notifyOnCancellation: true
            },
            recommendedServices: ['Serviço Padrão']
        };
    }

    private generateStandardWorkingHours(startHour: number, endHour: number): WorkingHours[] {
        const workingHours: WorkingHours[] = [];
        
        for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
            const isWeekend = dayOfWeek === 6 || dayOfWeek === 7;
            workingHours.push({
                dayOfWeek,
                isOpen: !isWeekend,
                openTime: `${startHour.toString().padStart(2, '0')}:00`,
                closeTime: `${endHour.toString().padStart(2, '0')}:00`
            });
        }
        
        return workingHours;
    }

    private getDefaultAppointmentSettings(): AppointmentSettings {
        return {
            defaultDuration: 60,
            advanceBookingDays: 30,
            requiresConfirmation: true,
            allowsCancellation: true,
            cancellationHours: 24,
            maxParticipantsPerSlot: 1,
            bufferTimeBetweenAppointments: 0
        };
    }
}
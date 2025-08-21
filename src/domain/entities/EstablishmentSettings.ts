import { randomUUID } from 'crypto';
import { WorkingHoursTemplate, CustomFieldTemplate } from './BusinessCategory';

export interface WorkingHours {
    dayOfWeek: number;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    breakStart?: string;
    breakEnd?: string;
}

export interface AppointmentSettings {
    defaultDuration: number;
    advanceBookingDays: number;
    requiresConfirmation: boolean;
    allowsCancellation: boolean;
    cancellationHours: number;
    maxParticipantsPerSlot: number;
    bufferTimeBetweenAppointments: number;
}

export interface PaymentSettings {
    allowsOnlinePayment: boolean;
    requiresPaymentUpfront: boolean;
    acceptedPaymentMethods: string[];
    cancellationFeePercentage: number;
}

export interface NotificationSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    whatsappNotifications: boolean;
    reminderHoursBefore: number[];
    notifyOnBooking: boolean;
    notifyOnCancellation: boolean;
}

export interface CustomField {
    id: string;
    name: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'date';
    required: boolean;
    options?: string[];
    value?: any;
}

export interface IntegrationSettings {
    googleCalendar: boolean;
    whatsappBusiness: boolean;
    mercadoPago: boolean;
    stripe: boolean;
    customIntegrations: Record<string, any>;
}

export class EstablishmentSettings {
    constructor(
        public readonly id: string,
        public readonly establishmentId: string,
        public readonly workingHours: WorkingHours[],
        public readonly appointmentSettings: AppointmentSettings,
        public readonly paymentSettings: PaymentSettings,
        public readonly notificationSettings: NotificationSettings,
        public readonly customFields: CustomField[],
        public readonly integrations: IntegrationSettings,
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date()
    ) {}

    static create(props: {
        establishmentId: string;
        workingHours?: WorkingHours[];
        appointmentSettings?: Partial<AppointmentSettings>;
        paymentSettings?: Partial<PaymentSettings>;
        notificationSettings?: Partial<NotificationSettings>;
        customFields?: CustomField[];
        integrations?: Partial<IntegrationSettings>;
    }): EstablishmentSettings {
        const id = randomUUID();
        
        const defaultAppointmentSettings: AppointmentSettings = {
            defaultDuration: 60,
            advanceBookingDays: 30,
            requiresConfirmation: true,
            allowsCancellation: true,
            cancellationHours: 24,
            maxParticipantsPerSlot: 1,
            bufferTimeBetweenAppointments: 0,
            ...props.appointmentSettings
        };

        const defaultPaymentSettings: PaymentSettings = {
            allowsOnlinePayment: false,
            requiresPaymentUpfront: false,
            acceptedPaymentMethods: ['cash'],
            cancellationFeePercentage: 0,
            ...props.paymentSettings
        };

        const defaultNotificationSettings: NotificationSettings = {
            emailNotifications: true,
            smsNotifications: false,
            whatsappNotifications: false,
            reminderHoursBefore: [24, 2],
            notifyOnBooking: true,
            notifyOnCancellation: true,
            ...props.notificationSettings
        };

        const defaultIntegrations: IntegrationSettings = {
            googleCalendar: false,
            whatsappBusiness: false,
            mercadoPago: false,
            stripe: false,
            customIntegrations: {},
            ...props.integrations
        };

        return new EstablishmentSettings(
            id,
            props.establishmentId,
            props.workingHours || [],
            defaultAppointmentSettings,
            defaultPaymentSettings,
            defaultNotificationSettings,
            props.customFields || [],
            defaultIntegrations
        );
    }

    updateWorkingHours(workingHours: WorkingHours[]): EstablishmentSettings {
        return new EstablishmentSettings(
            this.id,
            this.establishmentId,
            workingHours,
            this.appointmentSettings,
            this.paymentSettings,
            this.notificationSettings,
            this.customFields,
            this.integrations,
            this.createdAt,
            new Date()
        );
    }

    updateAppointmentSettings(settings: AppointmentSettings): EstablishmentSettings {
        return new EstablishmentSettings(
            this.id,
            this.establishmentId,
            this.workingHours,
            settings,
            this.paymentSettings,
            this.notificationSettings,
            this.customFields,
            this.integrations,
            this.createdAt,
            new Date()
        );
    }

    addCustomField(field: CustomField): EstablishmentSettings {
        const newCustomFields = [...this.customFields, field];
        return new EstablishmentSettings(
            this.id,
            this.establishmentId,
            this.workingHours,
            this.appointmentSettings,
            this.paymentSettings,
            this.notificationSettings,
            newCustomFields,
            this.integrations,
            this.createdAt,
            new Date()
        );
    }

    updateIntegrations(integrations: IntegrationSettings): EstablishmentSettings {
        return new EstablishmentSettings(
            this.id,
            this.establishmentId,
            this.workingHours,
            this.appointmentSettings,
            this.paymentSettings,
            this.notificationSettings,
            this.customFields,
            integrations,
            this.createdAt,
            new Date()
        );
    }
}
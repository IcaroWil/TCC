import { randomUUID } from 'crypto';

export enum BusinessCategoryType {
    BEAUTY_AESTHETICS = 'BEAUTY_AESTHETICS',
    HEALTH_WELLNESS = 'HEALTH_WELLNESS', 
    PROFESSIONAL_SERVICES = 'PROFESSIONAL_SERVICES',
    EDUCATION_TRAINING = 'EDUCATION_TRAINING',
    OTHER = 'OTHER'
}

export enum BusinessType {
    INDIVIDUAL = 'INDIVIDUAL',
    COMPANY = 'COMPANY'
}

export interface WorkingHoursTemplate {
    dayOfWeek: number;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    breakStart?: string;
    breakEnd?: string;
}

export interface CustomFieldTemplate {
    name: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'date';
    required: boolean;
    options?: string[];
}

export interface CategoryDefaultSettings {
    defaultAppointmentDuration: number;
    advanceBookingDays: number;
    requiresConfirmation: boolean;
    allowsCancellation: boolean;
    cancellationHours: number;
    allowsOnlinePayment: boolean;
    requiresEmployeeAssignment: boolean;
    maxParticipantsPerSlot: number;
    workingHoursTemplate: WorkingHoursTemplate[];
    customFieldsTemplate: CustomFieldTemplate[];
}

export class BusinessCategory {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly type: BusinessCategoryType,
        public readonly description: string,
        public readonly subcategories: string[],
        public readonly defaultSettings: CategoryDefaultSettings,
        public readonly isActive: boolean = true,
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date()
    ) {}

    static create(props: {
        name: string;
        type: BusinessCategoryType;
        description: string;
        subcategories: string[];
        defaultSettings: CategoryDefaultSettings;
    }): BusinessCategory {
        const id = randomUUID();
        return new BusinessCategory(
            id,
            props.name,
            props.type,
            props.description,
            props.subcategories,
            props.defaultSettings
        );
    }

    addSubcategory(subcategory: string): BusinessCategory {
        const newSubcategories = [...this.subcategories, subcategory];
        return new BusinessCategory(
            this.id,
            this.name,
            this.type,
            this.description,
            newSubcategories,
            this.defaultSettings,
            this.isActive,
            this.createdAt,
            new Date()
        );
    }

    updateSettings(newSettings: CategoryDefaultSettings): BusinessCategory {
        return new BusinessCategory(
            this.id,
            this.name,
            this.type,
            this.description,
            this.subcategories,
            newSettings,
            this.isActive,
            this.createdAt,
            new Date()
        );
    }

    deactivate(): BusinessCategory {
        return new BusinessCategory(
            this.id,
            this.name,
            this.type,
            this.description,
            this.subcategories,
            this.defaultSettings,
            false,
            this.createdAt,
            new Date()
        );
    }
}
import { AppError } from "../../shared/errors/AppError";

export class Phone {
    private readonly value: string;

    constructor(phone: string) {
        if (!phone) {
            throw new AppError('Phone is required', 400);
        }

        const cleanPhone = this.cleanPhone(phone);
        
        if (!this.isValid(cleanPhone)) {
            throw new AppError('Invalid phone format. Use format: (11) 99999-9999', 400);
        }

        this.value = this.formatPhone(cleanPhone);
    }

    private cleanPhone(phone: string): string {
        return phone.replace(/\D/g, '');
    }

    private isValid(phone: string): boolean {
        if (phone.length === 11) {
            return /^[1-9]{2}9[0-9]{8}$/.test(phone);
        } else if (phone.length === 10) {
            return /^[1-9]{2}[2-9][0-9]{7}$/.test(phone);
        }
        return false;
    }

    private formatPhone(phone: string): string {
        if (phone.length === 11) {
            return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
        } else {
            return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
        }
    }

    getValue(): string {
        return this.value;
    }

    getCleanValue(): string {
        return this.cleanPhone(this.value);
    }

    equals(other: Phone): boolean {
        return this.getCleanValue() === other.getCleanValue();
    }

    toString(): string {
        return this.value;
    }

    static create(phone: string): Phone {
        return new Phone(phone);
    }
}
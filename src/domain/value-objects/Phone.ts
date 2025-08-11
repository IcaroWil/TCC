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
        // Remove todos os caracteres não numéricos
        return phone.replace(/\D/g, '');
    }

    private isValid(phone: string): boolean {
        // Valida telefone brasileiro: 11 dígitos (celular) ou 10 dígitos (fixo)
        // Formato: DDD + número
        if (phone.length === 11) {
            // Celular: DDD + 9 + 8 dígitos
            return /^[1-9]{2}9[0-9]{8}$/.test(phone);
        } else if (phone.length === 10) {
            // Fixo: DDD + 8 dígitos
            return /^[1-9]{2}[2-9][0-9]{7}$/.test(phone);
        }
        return false;
    }

    private formatPhone(phone: string): string {
        if (phone.length === 11) {
            // Formato: (11) 99999-9999
            return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
        } else {
            // Formato: (11) 9999-9999
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
import { AppError } from "../../shared/errors/AppError";

export class Email {
    private readonly value: string;

    constructor(email: string) {
        if (!email) {
            throw new AppError('Email is required', 400);
        }

        if (!this.isValid(email)) {
            throw new AppError('Invalid email format', 400);
        }

        this.value = email.toLowerCase().trim();
    }

    private isValid(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    static create(email: string): Email {
        return new Email(email);
    }
}
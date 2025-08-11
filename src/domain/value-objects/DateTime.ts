import { AppError } from "../../shared/errors/AppError";

export class DateTime {
    private readonly value: Date;

    constructor(date: Date | string) {
        let parsedDate: Date;

        if (typeof date === 'string') {
            parsedDate = new Date(date);
        } else {
            parsedDate = new Date(date);
        }

        if (isNaN(parsedDate.getTime())) {
            throw new AppError('Invalid date format', 400);
        }

        this.value = parsedDate;
    }

    getValue(): Date {
        return new Date(this.value);
    }

    toString(): string {
        return this.value.toISOString();
    }

    toDateString(): string {
        return this.value.toLocaleDateString('pt-BR');
    }

    toTimeString(): string {
        return this.value.toLocaleTimeString('pt-BR');
    }

    toDateTimeString(): string {
        return this.value.toLocaleString('pt-BR');
    }

    equals(other: DateTime): boolean {
        return this.value.getTime() === other.value.getTime();
    }

    isBefore(other: DateTime): boolean {
        return this.value < other.value;
    }

    isAfter(other: DateTime): boolean {
        return this.value > other.value;
    }

    isSameDay(other: DateTime): boolean {
        return this.value.toDateString() === other.value.toDateString();
    }

    addDays(days: number): DateTime {
        const newDate = new Date(this.value);
        newDate.setDate(newDate.getDate() + days);
        return new DateTime(newDate);
    }

    addHours(hours: number): DateTime {
        const newDate = new Date(this.value);
        newDate.setHours(newDate.getHours() + hours);
        return new DateTime(newDate);
    }

    addMinutes(minutes: number): DateTime {
        const newDate = new Date(this.value);
        newDate.setMinutes(newDate.getMinutes() + minutes);
        return new DateTime(newDate);
    }

    isBusinessHour(): boolean {
        const hour = this.value.getHours();
        const dayOfWeek = this.value.getDay();
        
        // Segunda a Sexta (1-5), das 8h às 18h
        return dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 8 && hour < 18;
    }

    isWeekend(): boolean {
        const dayOfWeek = this.value.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // Domingo ou Sábado
    }

    static now(): DateTime {
        return new DateTime(new Date());
    }

    static create(date: Date | string): DateTime {
        return new DateTime(date);
    }

    static fromString(dateString: string): DateTime {
        return new DateTime(dateString);
    }

    static today(): DateTime {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new DateTime(today);
    }

    static tomorrow(): DateTime {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return new DateTime(tomorrow);
    }
}
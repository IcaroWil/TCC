import { randomUUID } from 'crypto';

export class User {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly name: string,
        public readonly phone: string,
        public readonly role: 'CLIENT' | 'ADMIN' | 'EMPLOYEE',
        public readonly establishmentId?: string,
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date()
    ) {}


    static create(props: {
        email: string;
        name: string;
        phone: string;
        role: 'CLIENT' | 'ADMIN' | 'EMPLOYEE';
        establishmentId?: string;
    }): User {
        const id = randomUUID();
        return new User(
            id,
            props.email,
            props.name,
            props.phone,
            props.role,
            props.establishmentId
        );
    }

    isAdmin(): boolean {
        return this.role === 'ADMIN';
    }

    isEmployee(): boolean {
        return this.role === 'EMPLOYEE';
    } 

    isClient(): boolean {
        return this.role === 'CLIENT';
    }
}
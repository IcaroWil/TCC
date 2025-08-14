import { randomUUID } from 'crypto';

export class Service {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly duration: number, // em minutos
        public readonly price: number,
        public readonly establishmentId: string,
        public readonly isActive: boolean = true,
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date()
    ) {}

      static create(props: {
        name: string;
        description: string;
        duration: number;
        price: number;
        establishmentId: string;
    }): Service {
        const id = randomUUID();
        return new Service(
            id,
            props.name,
            props.description,
            props.duration,
            props.price,
            props.establishmentId
        );
    }

      updatePrice(newPrice: number): Service {
        return new Service(
            this.id,
            this.name,
            this.description,
            this.duration,
            newPrice,
            this.establishmentId,
            this.isActive,
            this.createdAt,
            new Date()
        );
    }
}
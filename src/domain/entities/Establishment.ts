export class Establishment {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly address: string,
        public readonly city: string,
        public readonly state: string,
        public readonly zipCode: string,
        public readonly cnpj: string,
        public readonly isActive: boolean = true,
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date()
    ) {}

    static create(props: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        cnpj: string;
    }): Establishment {
        const id = crypto.randomUUID();
        return new Establishment(
            id,
            props.name,
            props.email,
            props.phone,
            props.address,
            props.city,
            props.state,
            props.zipCode,
            props.cnpj
        );
    }

    deactivate(): Establishment {
        return new Establishment(
            this.id,
            this.name,
            this.email,
            this.phone,
            this.address,
            this.city,
            this.state,
            this.zipCode,
            this.cnpj,
            false,
            this.createdAt,
            new Date()
        );
    }
}
import { IEstablishmentRepository } from "../../../domain/repositories/IEstablishmentRepository";
import { Establishment } from "../../../domain/entities/Establishment";
import { CreateEstablishmentDTO } from "../../dtos/CreateEstablishmentDTO";
import { AppError } from "../../../shared/errors/AppError";

export class CreateEstablishmentUseCase {
    constructor(
        private readonly establishmentRepository: IEstablishmentRepository
    ) {}

    async execute(data: CreateEstablishmentDTO): Promise<Establishment> {
        if (data.name.trim().length < 2) {
            throw new AppError("Establishment name must have at least 2 characters", 400);
        }

        if (data.state.length !== 2) {
            throw new AppError("State must have exactly 2 characters", 400);
        }

        const existingByEmail = await this.establishmentRepository.findByEmail(data.email);
        if (existingByEmail) {
            throw new AppError("An establishment with this email already exists", 409);
        }

        const existingByCnpj = await this.establishmentRepository.findByCnpj(data.cnpj);
        if (existingByCnpj) {
            throw new AppError("An establishment with this CNPJ already exists", 409);
        }

        const establishment = Establishment.create({
            name: data.name.trim(),
            email: data.email.toLowerCase().trim(),
            phone: data.phone.trim(),
            address: data.address.trim(),
            city: data.city.trim(),
            state: data.state.toUpperCase().trim(),
            zipCode: data.zipCode.trim(),
            cnpj: data.cnpj.trim()
        });

        try {
            return await this.establishmentRepository.create(establishment);
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new AppError("An establishment with this data already exists", 409);
            }
            throw new AppError("Failed to create establishment", 500);
        }
    }
}
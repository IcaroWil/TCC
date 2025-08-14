import { IEstablishmentRepository } from "../../../domain/repositories/IEstablishmentRepository";
import { Establishment } from "../../../domain/entities/Establishment";
import { AppError } from "../../../shared/errors/AppError";

export interface UpdateEstablishmentRequest {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    cnpj?: string;
    isActive?: boolean;
}

export class UpdateEstablishmentUseCase {
    constructor(
        private readonly establishmentRepository: IEstablishmentRepository
    ) {}

    async execute(request: UpdateEstablishmentRequest): Promise<Establishment> {
        if (!request.id || request.id.trim() === '') {
            throw new AppError("Establishment ID is required", 400);
        }

        const existingEstablishment = await this.establishmentRepository.findById(request.id);
        if (!existingEstablishment) {
            throw new AppError("Establishment not found", 404);
        }

        if (request.name !== undefined && request.name.trim().length < 2) {
            throw new AppError("Establishment name must have at least 2 characters", 400);
        }

        if (request.state !== undefined && request.state.length !== 2) {
            throw new AppError("State must have exactly 2 characters", 400);
        }

        if (request.email !== undefined && request.email !== existingEstablishment.email) {
            const existingByEmail = await this.establishmentRepository.findByEmail(request.email);
            if (existingByEmail && existingByEmail.id !== request.id) {
                throw new AppError("An establishment with this email already exists", 409);
            }
        }

        if (request.cnpj !== undefined && request.cnpj !== existingEstablishment.cnpj) {
            const existingByCnpj = await this.establishmentRepository.findByCnpj(request.cnpj);
            if (existingByCnpj && existingByCnpj.id !== request.id) {
                throw new AppError("An establishment with this CNPJ already exists", 409);
            }
        }

        const updatedEstablishment = new Establishment(
            existingEstablishment.id,
            request.name !== undefined ? request.name.trim() : existingEstablishment.name,
            request.email !== undefined ? request.email.toLowerCase().trim() : existingEstablishment.email,
            request.phone !== undefined ? request.phone.trim() : existingEstablishment.phone,
            request.address !== undefined ? request.address.trim() : existingEstablishment.address,
            request.city !== undefined ? request.city.trim() : existingEstablishment.city,
            request.state !== undefined ? request.state.toUpperCase().trim() : existingEstablishment.state,
            request.zipCode !== undefined ? request.zipCode.trim() : existingEstablishment.zipCode,
            request.cnpj !== undefined ? request.cnpj.trim() : existingEstablishment.cnpj,
            request.isActive !== undefined ? request.isActive : existingEstablishment.isActive,
            existingEstablishment.createdAt,
            new Date()
        );

        try {
            return await this.establishmentRepository.update(updatedEstablishment);
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new AppError("An establishment with this data already exists", 409);
            }
            throw new AppError("Failed to update establishment", 500);
        }
    }
}
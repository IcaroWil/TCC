import { IEstablishmentRepository } from "../../../../domain/repositories/IEstablishmentRepository";
import { Establishment } from "../../../../domain/entities/Establishment";
import { AppError } from "../../../../shared/errors/AppError";
import { IUseCase } from "../../../interfaces/IUseCase";

interface UpdateEstablishmentRequest {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

export class UpdateEstablishmentUseCase implements IUseCase<UpdateEstablishmentRequest, Establishment> {
    constructor(
        private readonly establishmentRepository: IEstablishmentRepository
    ) {}

    async execute(data: UpdateEstablishmentRequest): Promise<Establishment> {
        const establishment = await this.establishmentRepository.findById(data.id);
        if (!establishment) {
            throw new AppError("Establishment not found", 404);
        }

        if (data.name && data.name.trim().length < 2) {
            throw new AppError("Establishment name must have at least 2 characters", 400);
        }

        if (data.state && data.state.length !== 2) {
            throw new AppError("State must have exactly 2 characters", 400);
        }

        if (data.email && data.email !== establishment.email) {
            const existingByEmail = await this.establishmentRepository.findByEmail(data.email);
            if (existingByEmail) {
                throw new AppError("An establishment with this email already exists", 409);
            }
        }

        const updatedEstablishment = new Establishment(
            establishment.id,
            data.name ? data.name.trim() : establishment.name,
            data.email ? data.email.toLowerCase().trim() : establishment.email,
            data.phone ? data.phone.trim() : establishment.phone,
            data.address ? data.address.trim() : establishment.address,
            data.city ? data.city.trim() : establishment.city,
            data.state ? data.state.toUpperCase().trim() : establishment.state,
            data.zipCode ? data.zipCode.trim() : establishment.zipCode,
            establishment.businessCategoryId,
            establishment.subcategory,
            establishment.businessType,
            establishment.document,
            establishment.description,
            establishment.website,
            establishment.socialMedia,
            establishment.isActive,
            establishment.createdAt,
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
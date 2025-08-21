import { IEstablishmentRepository } from "../../../../domain/repositories/IEstablishmentRepository";
import { IBusinessCategoryRepository } from "../../../../domain/repositories/IBusinessCategoryRepository";
import { Establishment } from "../../../../domain/entities/Establishment";
import { CreateEstablishmentDTO } from "../../../dtos/CreateEstablishmentDTO";
import { AppError } from "../../../../shared/errors/AppError";
import { IUseCase } from "../../../interfaces/IUseCase";

export class CreateEstablishmentUseCase implements IUseCase<CreateEstablishmentDTO, Establishment> {
    constructor(
        private readonly establishmentRepository: IEstablishmentRepository,
        private readonly businessCategoryRepository: IBusinessCategoryRepository
    ) {}

    async execute(data: CreateEstablishmentDTO): Promise<Establishment> {
        if (data.name.trim().length < 2) {
            throw new AppError("Nome do estabelecimento deve ter pelo menos 2 caracteres", 400);
        }

        if (data.state.length !== 2) {
            throw new AppError("Estado deve ter exatamente 2 caracteres", 400);
        }

        const existingByEmail = await this.establishmentRepository.findByEmail(data.email);
        if (existingByEmail) {
            throw new AppError("Já existe um estabelecimento com este email", 409);
        }

        const existingByDocument = await this.establishmentRepository.findByDocument(data.document);
        if (existingByDocument) {
            throw new AppError("Já existe um estabelecimento com este documento", 409);
        }

        const category = await this.businessCategoryRepository.findById(data.businessCategoryId);
        if (!category) {
            throw new AppError("Categoria de negócio não encontrada", 404);
        }

        if (!category.subcategories.includes(data.subcategory)) {
            throw new AppError("Subcategoria inválida para esta categoria", 400);
        }

        const establishment = Establishment.create({
            name: data.name.trim(),
            email: data.email.toLowerCase().trim(),
            phone: data.phone.trim(),
            address: data.address.trim(),
            city: data.city.trim(),
            state: data.state.toUpperCase().trim(),
            zipCode: data.zipCode.trim(),
            businessCategoryId: data.businessCategoryId,
            subcategory: data.subcategory,
            businessType: data.businessType,
            document: data.document.trim(),
            description: data.description?.trim(),
            website: data.website?.trim(),
            socialMedia: data.socialMedia
        });

        try {
            return await this.establishmentRepository.create(establishment);
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new AppError("Já existe um estabelecimento com estes dados", 409);
            }
            throw new AppError("Falha ao criar estabelecimento", 500);
        }
    }
}
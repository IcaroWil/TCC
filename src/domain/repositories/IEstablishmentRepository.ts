import { Establishment } from "../entities/Establishment";
import { BusinessCategoryType } from "../entities/BusinessCategory";

export interface IEstablishmentRepository {
    create(establishment: Establishment): Promise<Establishment>;
    findById(id: string): Promise<Establishment | null>;
    findByEmail(email: string): Promise<Establishment | null>;
    findByCnpj(cnpj: string): Promise<Establishment | null>;
    findByDocument(document: string): Promise<Establishment | null>;
    findByCategory(categoryId: string): Promise<Establishment[]>;
    findByCategoryType(categoryType: BusinessCategoryType): Promise<Establishment[]>;
    update(establishment: Establishment): Promise<Establishment>;
    delete(id: string): Promise<void>;
    list(page: number, limit: number): Promise<{establishment: Establishment[], total: number}>;
    findActive(): Promise<Establishment[]>;
}
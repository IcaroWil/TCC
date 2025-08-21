import { BusinessCategory, BusinessCategoryType } from '../entities/BusinessCategory';

export interface IBusinessCategoryRepository {
    findAll(): Promise<BusinessCategory[]>;
    findById(id: string): Promise<BusinessCategory | null>;
    findByType(type: BusinessCategoryType): Promise<BusinessCategory[]>;
    findActiveCategories(): Promise<BusinessCategory[]>;
    create(category: BusinessCategory): Promise<BusinessCategory>;
    update(category: BusinessCategory): Promise<BusinessCategory>;
    delete(id: string): Promise<void>;
}
import { IUseCase } from '../../../interfaces/IUseCase';
import { BusinessCategory } from '../../../../domain/entities/BusinessCategory';
import { IBusinessCategoryRepository } from '../../../../domain/repositories/IBusinessCategoryRepository';

export class ListBusinessCategoriesUseCase implements IUseCase<void, BusinessCategory[]> {
    constructor(
        private businessCategoryRepository: IBusinessCategoryRepository
    ) {}

    async execute(): Promise<BusinessCategory[]> {
        return await this.businessCategoryRepository.findActiveCategories();
    }
}
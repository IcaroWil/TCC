import { BusinessType } from '../../domain/entities/BusinessCategory';
import { SocialMediaLinks } from '../../domain/value-objects/SocialMediaLinks';

export interface CreateEstablishmentDTO {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    businessCategoryId: string;
    subcategory: string;
    businessType: BusinessType;
    document: string;
    description?: string;
    website?: string;
    socialMedia?: SocialMediaLinks;
}
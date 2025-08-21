import { randomUUID } from 'crypto';
import { BusinessType } from './BusinessCategory';
import { SocialMediaLinks } from '../value-objects/SocialMediaLinks';

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
        public readonly businessCategoryId: string,
        public readonly subcategory: string,
        public readonly businessType: BusinessType,
        public readonly document: string,
        public readonly description?: string,
        public readonly website?: string,
        public readonly socialMedia?: SocialMediaLinks,
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
        businessCategoryId: string;
        subcategory: string;
        businessType: BusinessType;
        document: string;
        description?: string;
        website?: string;
        socialMedia?: SocialMediaLinks;
    }): Establishment {
        const id = randomUUID();
        return new Establishment(
            id,
            props.name,
            props.email,
            props.phone,
            props.address,
            props.city,
            props.state,
            props.zipCode,
            props.businessCategoryId,
            props.subcategory,
            props.businessType,
            props.document,
            props.description,
            props.website,
            props.socialMedia
        );
    }

    updateBusinessInfo(info: {
        name?: string;
        email?: string;
        phone?: string;
        description?: string;
        website?: string;
    }): Establishment {
        return new Establishment(
            this.id,
            info.name || this.name,
            info.email || this.email,
            info.phone || this.phone,
            this.address,
            this.city,
            this.state,
            this.zipCode,
            this.businessCategoryId,
            this.subcategory,
            this.businessType,
            this.document,
            info.description || this.description,
            info.website || this.website,
            this.socialMedia,
            this.isActive,
            this.createdAt,
            new Date()
        );
    }

    updateSocialMedia(socialMedia: SocialMediaLinks): Establishment {
        return new Establishment(
            this.id,
            this.name,
            this.email,
            this.phone,
            this.address,
            this.city,
            this.state,
            this.zipCode,
            this.businessCategoryId,
            this.subcategory,
            this.businessType,
            this.document,
            this.description,
            this.website,
            socialMedia,
            this.isActive,
            this.createdAt,
            new Date()
        );
    }

    changeCategory(categoryId: string, subcategory: string): Establishment {
        return new Establishment(
            this.id,
            this.name,
            this.email,
            this.phone,
            this.address,
            this.city,
            this.state,
            this.zipCode,
            categoryId,
            subcategory,
            this.businessType,
            this.document,
            this.description,
            this.website,
            this.socialMedia,
            this.isActive,
            this.createdAt,
            new Date()
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
            this.businessCategoryId,
            this.subcategory,
            this.businessType,
            this.document,
            this.description,
            this.website,
            this.socialMedia,
            false,
            this.createdAt,
            new Date()
        );
    }
}
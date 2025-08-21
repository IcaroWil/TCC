export class SocialMediaLinks {
    constructor(
        public readonly instagram?: string,
        public readonly facebook?: string,
        public readonly whatsapp?: string,
        public readonly linkedin?: string,
        public readonly twitter?: string,
        public readonly youtube?: string,
        public readonly tiktok?: string
    ) {
        this.validateUrls();
    }

    private validateUrls(): void {
        const urlPattern = /^https?:\/\/.+/;
        const phonePattern = /^\+?[\d\s\-\(\)]+$/;

        if (this.instagram && !urlPattern.test(this.instagram)) {
            throw new Error('Instagram URL inválida');
        }
        if (this.facebook && !urlPattern.test(this.facebook)) {
            throw new Error('Facebook URL inválida');
        }
        if (this.whatsapp && !phonePattern.test(this.whatsapp)) {
            throw new Error('WhatsApp deve ser um número de telefone válido');
        }
        if (this.linkedin && !urlPattern.test(this.linkedin)) {
            throw new Error('LinkedIn URL inválida');
        }
        if (this.twitter && !urlPattern.test(this.twitter)) {
            throw new Error('Twitter URL inválida');
        }
        if (this.youtube && !urlPattern.test(this.youtube)) {
            throw new Error('YouTube URL inválida');
        }
        if (this.tiktok && !urlPattern.test(this.tiktok)) {
            throw new Error('TikTok URL inválida');
        }
    }

    static create(links: {
        instagram?: string;
        facebook?: string;
        whatsapp?: string;
        linkedin?: string;
        twitter?: string;
        youtube?: string;
        tiktok?: string;
    }): SocialMediaLinks {
        return new SocialMediaLinks(
            links.instagram,
            links.facebook,
            links.whatsapp,
            links.linkedin,
            links.twitter,
            links.youtube,
            links.tiktok
        );
    }

    toJSON(): Record<string, string> {
        const result: Record<string, string> = {};
        
        if (this.instagram) result.instagram = this.instagram;
        if (this.facebook) result.facebook = this.facebook;
        if (this.whatsapp) result.whatsapp = this.whatsapp;
        if (this.linkedin) result.linkedin = this.linkedin;
        if (this.twitter) result.twitter = this.twitter;
        if (this.youtube) result.youtube = this.youtube;
        if (this.tiktok) result.tiktok = this.tiktok;
        
        return result;
    }

    static fromJSON(data: Record<string, string>): SocialMediaLinks {
        return new SocialMediaLinks(
            data.instagram,
            data.facebook,
            data.whatsapp,
            data.linkedin,
            data.twitter,
            data.youtube,
            data.tiktok
        );
    }
}
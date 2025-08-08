export interface CreateUserDTO {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: 'CLIENT' | 'ADMIN' | 'EMPLOYEE';
    establishmentId?: string;
}

export interface AuthenticateUserDTO {
    email: string;
    password: string;
}

export interface AuthenticateUserResponseDTO {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
    token: string;
}
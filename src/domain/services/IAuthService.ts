export interface IAuthService {
    generateToken(userId: string): Promise<string>;
    verifyToken(token: string): Promise<{ userId: string } | null>;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
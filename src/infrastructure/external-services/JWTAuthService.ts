import { IAuthService } from "../../domain/services/IAuthService";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class JWTAuthService implements IAuthService {
    private readonly jwtSecret: string;
    private readonly jwtExpiration: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'minha-key';
        this.jwtExpiration = process.env.JWT_EXPIRATION || '24';
    }

    async generateToken(userId: string): Promise<string> {
        return jwt.sign({ userId }, this.jwtSecret, {
            expiresIn: this.jwtExpiration,
        }); 
    }

    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
            return decoded;
        } catch {
            return null;
        }
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword)
    }
}
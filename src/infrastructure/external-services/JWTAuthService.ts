import { IAuthService } from "../../domain/services/IAuthService";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/environment';

export class JWTAuthService implements IAuthService {
    private readonly jwtSecret: string;
    private readonly jwtExpiration: string;

    constructor() {
        if (!env.jwtSecret) {
            throw new Error('JWT_SECRET is required for security');
        }
        
        this.jwtSecret = env.jwtSecret;
        this.jwtExpiration = env.jwtExpiration || '24';
    }

    async generateToken(userId: string): Promise<string> {
        const payload = {
            userId,
            iat: Math.floor(Date.now() / 1000),
            iss: 'saas-barbearia'
        };

        return jwt.sign(payload, this.jwtSecret, {
            expiresIn: '24h',
            algorithm: 'HS256'
        });
    }

    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            const decoded = jwt.verify(token, this.jwtSecret, {
                algorithms: ['HS256'],
                issuer: 'saas-barbearia'
            }) as { userId: string };
            return decoded;
        } catch (error) {
            if (env.nodeEnv === 'development') {
                console.error('JWT verification failed:', error);
            }
            return null;
        }
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = env.nodeEnv === 'production' ? 12 : 10;
        return bcrypt.hash(password, saltRounds);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
import jwt from 'jsonwebtoken';
import { ITokenService } from '../../application/use-cases/user/AuthenticateUserUseCase';
import { env } from '../config/environment';

export class JwtTokenService implements ITokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = env.jwtSecret || 'default-secret-key';
    this.expiresIn = env.jwtExpiration || '24h';
  }

  generateToken(payload: { userId: string; email: string; role: string }): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
      issuer: 'saas-barbearia',
      audience: 'saas-barbearia-users'
    } as jwt.SignOptions);
  }

  verifyToken(token: string): { userId: string; email: string; role: string } {
    try {
      const decoded = jwt.verify(token, this.secret, {
        issuer: 'saas-barbearia',
        audience: 'saas-barbearia-users'
      }) as any;

      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}
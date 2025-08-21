import bcrypt from 'bcryptjs';
import { IHashService } from '../../application/use-cases/user/CreateUserUseCase';

export class BcryptHashService implements IHashService {
  private readonly saltRounds = 12;

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
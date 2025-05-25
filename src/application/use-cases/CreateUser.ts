import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { IUserRepository } from "../../ports/IUserRepository";
import { User } from "../../domain/entities/User";

export class CreateUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(email: string, password: string): Promise<void> {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User(uuidv4(), email, hashed);
    await this.userRepo.create(user);
  }
}

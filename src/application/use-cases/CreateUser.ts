import { IUserRepository } from "../../ports/IUserRepository";
import { User } from "../../domain/entities/User";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(uuidv4(), email, hashedPassword);
    await this.userRepository.create(user);
  }
}

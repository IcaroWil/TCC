import { IUserRepository } from "../../ports/IUserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class LoginUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Usuário não encontrado");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Senha incorreta");

    return jwt.sign({ userId: user.id }, "secret", { expiresIn: "1h" });
  }
}

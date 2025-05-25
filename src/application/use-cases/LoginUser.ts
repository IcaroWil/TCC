import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../ports/IUserRepository";

export class LoginUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("Usuário não encontrado");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Senha incorreta");

    return jwt.sign({ userId: user.id }, "secret", { expiresIn: "1h" });
  }
}

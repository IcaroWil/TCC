import { Request, Response } from "express";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { CreateUser } from "../../application/use-cases/CreateUser";
import { LoginUser } from "../../application/use-cases/LoginUser";

const userRepo = new InMemoryUserRepository();

export class AuthController {
  static async cadastro(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const useCase = new CreateUser(userRepo);
      await useCase.execute(email, password);
      res.status(201).send("Usuário cadastrado");
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const useCase = new LoginUser(userRepo);
      const token = await useCase.execute(email, password);
      res.json({ token });
    } catch (err: any) {
      res.status(401).send(err.message);
    }
  }
}

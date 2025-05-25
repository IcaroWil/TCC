import { Request, Response } from "express";

export class HomeController {
  static async home(req: Request, res: Response) {
    res.send("Bem-vindo à página principal da Barbearia!");
  }
}

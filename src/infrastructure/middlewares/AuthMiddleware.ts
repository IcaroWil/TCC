import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function AuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send("Token não fornecido");
    return;
  }

  const [, token] = authHeader.split(" ");
  try {
    const decoded = jwt.verify(token, "secret");
    (req as any).user = decoded;
    next();
  } catch {
    res.status(403).send("Token inválido");
  }
}

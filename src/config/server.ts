import express from "express";
import { AuthController } from "../infrastructure/controllers/AuthController";
import { HomeController } from "../infrastructure/controllers/HomeController";
import { AuthMiddleware } from "../infrastructure/middlewares/AuthMiddleware";

const app = express();
app.use(express.json());

app.post("/cadastro", AuthController.cadastro);
app.post("/login", AuthController.login);
app.get("/home", AuthMiddleware, HomeController.home);

export default app;

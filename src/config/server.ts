import express from "express";
import { AuthController } from "../infrastructure/controllers/AuthController";
import { AppointmentController } from "../infrastructure/controllers/AppointmentController";
import { AuthMiddleware } from "../infrastructure/middlewares/AuthMiddleware";

const app = express();
app.use(express.json());

app.post("/cadastro", AuthController.cadastro);
app.post("/login", AuthController.login);

app.post("/agendamentos", AuthMiddleware, AppointmentController.criar);
app.get("/agendamentos", AuthMiddleware, AppointmentController.listar);

export default app;

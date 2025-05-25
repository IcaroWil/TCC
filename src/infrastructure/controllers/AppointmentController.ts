import { Request, Response } from "express";
import { InMemoryAppointmentRepository } from "../repositories/InMemoryAppointmentRepository";
import { CreateAppointment } from "../../application/use-cases/CreateAppointment";
import { ListAppointmentsByUser } from "../../application/use-cases/ListAppointmentsByUser";

const appointmentRepo = new InMemoryAppointmentRepository();

export class AppointmentController {
  static async criar(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { date, service } = req.body;
      const useCase = new CreateAppointment(appointmentRepo);
      await useCase.execute(userId, date, service);
      res.status(201).send("Agendamento criado");
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  }

  static async listar(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const useCase = new ListAppointmentsByUser(appointmentRepo);
      const result = await useCase.execute(userId);
      res.json(result);
    } catch (err: any) {
      res.status(400).send(err.message);
    }
  }
}

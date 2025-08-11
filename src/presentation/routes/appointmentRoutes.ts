import { Router } from "express";
import { AppointmentController } from "../controllers/AppointmentController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

export function createAppointmentRoutes(
    appointmentController: AppointmentController,
    authMiddleware: AuthMiddleware
): Router {
    const router = Router();

    router.post('/',
        (req, res, next) => authMiddleware.handle(req, res, next),
        (req, res) => appointmentController.create(req, res)
    );

    router.get('/',
        (req, res, next) => authMiddleware.handle(req, res, next),
        (req, res) => appointmentController.list(req, res)
    );

    return router;
}
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

export function createUserRoutes (
    userController: UserController,
    authMiddleware: AuthMiddleware
): Router {
    const router = Router();

    router.post('/register', (req, res) => userController.create(req, res));
    router.post('/login', (req, res) => userController.authenticate(req, res));
    router.get('/profile',
        (req, res, next) => authMiddleware.handle(req, res, next),
        (req, res) => userController.getProfile(req, res)
    );

    return router;
}
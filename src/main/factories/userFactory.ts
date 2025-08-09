import { AuthenticateUserUseCase } from "../../application/use-cases/user/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../application/use-cases/user/CreateUserUseCase";
import { prisma } from "../../infrastructure/config/database";
import { PrismaUserRepository } from "../../infrastructure/database/repositories/PrismaUserRepository";
import { JWTAuthService } from "../../infrastructure/external-services/JWTAuthService";
import { UserController } from "../../presentation/controllers/UserController";
import { AuthMiddleware } from "../../presentation/middlewares/authMiddleware";

export const makeUserController = (): UserController => {
    const userRepository = new PrismaUserRepository(prisma);
    const authService = new JWTAuthService();

    const createUserUseCase = new CreateUserUseCase(userRepository, authService);
    const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository, authService);

    return new UserController(createUserUseCase, authenticateUserUseCase);
};

export const makeAuthMiddleware = (): AuthMiddleware => {
    const userRepository = new PrismaUserRepository(prisma);
    const authService = new JWTAuthService();

    return new AuthMiddleware(authService, userRepository);
};
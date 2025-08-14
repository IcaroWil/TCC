import { AuthenticateUserUseCase } from "../../application/use-cases/user/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../application/use-cases/user/CreateUserUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/user/GetUserByIdUseCase";
import { ListUsersUseCase } from "../../application/use-cases/user/ListUsersUseCase";
import { UpdateUserUseCase } from "../../application/use-cases/user/UpdateUserUseCase";
import { DeleteUserUseCase } from "../../application/use-cases/user/DeleteUserUseCase";
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
    const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    const listUsersUseCase = new ListUsersUseCase(userRepository);
    const updateUserUseCase = new UpdateUserUseCase(userRepository);
    const deleteUserUseCase = new DeleteUserUseCase(userRepository);

    return new UserController(
        createUserUseCase,
        authenticateUserUseCase,
        getUserByIdUseCase,
        listUsersUseCase,
        updateUserUseCase,
        deleteUserUseCase
    );
};

export const makeAuthMiddleware = (): AuthMiddleware => {
    const userRepository = new PrismaUserRepository(prisma);
    const authService = new JWTAuthService();

    return new AuthMiddleware(authService, userRepository);
};
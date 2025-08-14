import { CreateAppointmentUsecase } from "../../application/use-cases/appointment/CreateAppointmentUseCase";
import { ListAppointmentsUseCase } from "../../application/use-cases/appointment/ListAppointmentsUseCase";
import { GetAppointmentByIdUseCase } from "../../application/use-cases/appointment/GetAppointmentByIdUseCase";
import { UpdateAppointmentUseCase } from "../../application/use-cases/appointment/UpdateAppointmentUseCase";
import { DeleteAppointmentUseCase } from "../../application/use-cases/appointment/DeleteAppointmentUseCase";
import { prisma } from "../../infrastructure/config/database";
import { PrismaAppointmentRepository } from "../../infrastructure/database/repositories/PrismaAppointmentRepository";
import { PrismaServiceRepository } from "../../infrastructure/database/repositories/PrismaServiceRepository";
import { PrismaUserRepository } from "../../infrastructure/database/repositories/PrismaUserRepository";
import { EmailNotificationService } from "../../infrastructure/external-services/EmailNotificationService";
import { AppointmentController } from "../../presentation/controllers/AppointmentController";

export const makeAppointmentController = (): AppointmentController => {
    const appointmentRepository = new PrismaAppointmentRepository(prisma);
    const serviceRepository = new PrismaServiceRepository(prisma);
    const userRepository = new PrismaUserRepository(prisma);
    const notificationService = new EmailNotificationService();

    const createAppointmentUseCase = new CreateAppointmentUsecase(
        appointmentRepository,
        serviceRepository,
        userRepository,
        notificationService
    );

    const listAppointmentsUseCase = new ListAppointmentsUseCase(appointmentRepository);
    const getAppointmentByIdUseCase = new GetAppointmentByIdUseCase(appointmentRepository);
    const updateAppointmentUseCase = new UpdateAppointmentUseCase(appointmentRepository);
    const deleteAppointmentUseCase = new DeleteAppointmentUseCase(appointmentRepository);

    return new AppointmentController(
        createAppointmentUseCase,
        listAppointmentsUseCase,
        getAppointmentByIdUseCase,
        updateAppointmentUseCase,
        deleteAppointmentUseCase
    );
};
import { CreateAppointmentUsecase } from "../../application/use-cases/appointment/CreateAppointmentUseCase";
import { ListAppointmentsUseCase } from "../../application/use-cases/appointment/ListAppointmentsUseCase";
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

    return new AppointmentController(createAppointmentUseCase, listAppointmentsUseCase);
}
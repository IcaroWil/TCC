import { EstablishmentController } from '../../presentation/controllers/EstablishmentController';
import { CreateEstablishmentUseCase } from '../../application/use-cases/establishment/CreateEstablishmentUseCase';
import { GetEstablishmentByIdUseCase } from '../../application/use-cases/establishment/GetEstablishmentByIdUseCase';
import { ListEstablishmentsUseCase } from '../../application/use-cases/establishment/ListEstablishmentsUseCase';
import { UpdateEstablishmentUseCase } from '../../application/use-cases/establishment/UpdateEstablishmentUseCase';
import { DeleteEstablishmentUseCase } from '../../application/use-cases/establishment/DeleteEstablishmentUseCase';
import { PrismaEstablishmentRepository } from '../../infrastructure/database/repositories/PrismaEstablishmentRepository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const makeEstablishmentController = (): EstablishmentController => {
    const establishmentRepository = new PrismaEstablishmentRepository(prisma);
    
    const createEstablishmentUseCase = new CreateEstablishmentUseCase(establishmentRepository);
    const getEstablishmentByIdUseCase = new GetEstablishmentByIdUseCase(establishmentRepository);
    const listEstablishmentsUseCase = new ListEstablishmentsUseCase(establishmentRepository);
    const updateEstablishmentUseCase = new UpdateEstablishmentUseCase(establishmentRepository);
    const deleteEstablishmentUseCase = new DeleteEstablishmentUseCase(establishmentRepository);
    
    return new EstablishmentController(
        createEstablishmentUseCase,
        getEstablishmentByIdUseCase,
        listEstablishmentsUseCase,
        updateEstablishmentUseCase,
        deleteEstablishmentUseCase
    );
};
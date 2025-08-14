import { ServiceController } from '../../presentation/controllers/ServiceController';
import { CreateServiceUseCase } from '../../application/use-cases/service/CreateServiceUseCase';
import { GetServiceByIdUseCase } from '../../application/use-cases/service/GetServiceByIdUseCase';
import { ListServicesUseCase } from '../../application/use-cases/service/ListServicesUseCase';
import { UpdateServiceUseCase } from '../../application/use-cases/service/UpdateServiceUseCase';
import { DeleteServiceUseCase } from '../../application/use-cases/service/DeleteServiceUseCase';
import { PrismaServiceRepository } from '../../infrastructure/database/repositories/PrismaServiceRepository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const makeServiceController = (): ServiceController => {
    const serviceRepository = new PrismaServiceRepository(prisma);
    
    const createServiceUseCase = new CreateServiceUseCase(serviceRepository);
    const getServiceByIdUseCase = new GetServiceByIdUseCase(serviceRepository);
    const listServicesUseCase = new ListServicesUseCase(serviceRepository);
    const updateServiceUseCase = new UpdateServiceUseCase(serviceRepository);
    const deleteServiceUseCase = new DeleteServiceUseCase(serviceRepository);
    
    return new ServiceController(
        createServiceUseCase,
        getServiceByIdUseCase,
        listServicesUseCase,
        updateServiceUseCase,
        deleteServiceUseCase
    );
};
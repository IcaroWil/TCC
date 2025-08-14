import { WinstonLoggerService } from "../../infrastructure/external-services/WinstonLoggerService";
import { LoggingMiddleware } from "../../presentation/middlewares/loggingMiddleware";
import { ErrorHandlerMiddleware } from "../../presentation/middlewares/errorHandler";
import { ILoggerService } from "../../domain/services/ILoggerService";

/**
 * Factory para sistema de Logging - Main Layer
 * 
 * Seguindo Clean Architecture e SOLID:
 * - **Main Layer**: Composição de dependências e injeção
 * - **Dependency Inversion**: Injeta implementações concretas
 * - **Single Responsibility**: Responsável apenas por criar instâncias de logging
 * - **Factory Pattern**: Centraliza criação de objetos relacionados
 * 
 * Esta factory é responsável por criar e configurar todos os componentes
 * relacionados ao sistema de logging da aplicação.
 */

/**
 * Criar instância do Logger Service
 */
export const makeLoggerService = (): ILoggerService => {
    return new WinstonLoggerService();
};

/**
 * Criar middleware de logging de requisições
 */
export const makeLoggingMiddleware = (): LoggingMiddleware => {
    const loggerService = makeLoggerService();
    return new LoggingMiddleware(loggerService);
};

/**
 * Criar middleware de tratamento de erros
 */
export const makeErrorHandlerMiddleware = (): ErrorHandlerMiddleware => {
    const loggerService = makeLoggerService();
    return new ErrorHandlerMiddleware(loggerService);
};

/**
 * Criar função de tratamento de erros (compatibilidade)
 */
export const makeErrorHandler = () => {
    const loggerService = makeLoggerService();
    const errorHandlerMiddleware = new ErrorHandlerMiddleware(loggerService);
    return errorHandlerMiddleware.handle();
};
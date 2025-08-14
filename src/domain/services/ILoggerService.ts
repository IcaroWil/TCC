/**
 * Interface do Logger Service - Domain Layer
 * 
 * Seguindo Clean Architecture e Hexagonal Architecture:
 * - **Domain Layer**: Interface (Port) que define o contrato
 * - **Dependency Inversion**: Camadas superiores dependem desta abstração
 * - **Interface Segregation**: Interface específica para logging
 * 
 * Esta interface define o que o sistema precisa para logging,
 * sem se preocupar com a implementação específica.
 */

export interface ILoggerService {
  /**
   * Log de erro - para erros críticos do sistema
   */
  error(message: string, meta?: any): void;
  
  /**
   * Log de aviso - para situações que precisam atenção
   */
  warn(message: string, meta?: any): void;
  
  /**
   * Log de informação - para eventos importantes do sistema
   */
  info(message: string, meta?: any): void;
  
  /**
   * Log de debug - para desenvolvimento e troubleshooting
   */
  debug(message: string, meta?: any): void;
  
  /**
   * Log de requisições HTTP
   */
  http(message: string, meta?: any): void;
  
  /**
   * Log estruturado para operações de negócio
   */
  logOperation(operation: string, data: {
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    success: boolean;
    duration?: number;
    error?: string;
    metadata?: any;
  }): void;
  
  /**
   * Log de eventos de segurança
   */
  security(event: string, data: {
    userId?: string;
    ip?: string;
    userAgent?: string;
    action: string;
    success: boolean;
    reason?: string;
  }): void;
  
  /**
   * Log de performance do sistema
   */
  performance(operation: string, duration: number, metadata?: any): void;
}
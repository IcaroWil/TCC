export abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly field?: string;
  public readonly value?: any;

  constructor(message: string, field?: string, value?: any) {
    super(message, 400);
    this.field = field;
    this.value = value;
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  public readonly requiredRole?: string;
  public readonly userRole?: string;

  constructor(message: string = 'Access denied', requiredRole?: string, userRole?: string) {
    super(message, 403);
    this.requiredRole = requiredRole;
    this.userRole = userRole;
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  public readonly resource: string;
  public readonly resourceId?: string;

  constructor(resource: string, resourceId?: string) {
    const message = resourceId 
      ? `${resource} with ID '${resourceId}' not found`
      : `${resource} not found`;
    
    super(message, 404);
    this.resource = resource;
    this.resourceId = resourceId;
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  public readonly resource: string;
  public readonly conflictField?: string;

  constructor(resource: string, conflictField?: string, message?: string) {
    const defaultMessage = conflictField 
      ? `${resource} with this ${conflictField} already exists`
      : `${resource} already exists`;
    
    super(message || defaultMessage, 409);
    this.resource = resource;
    this.conflictField = conflictField;
    this.name = 'ConflictError';
  }
}

export class BusinessRuleError extends AppError {
  public readonly rule: string;

  constructor(message: string, rule: string) {
    super(message, 422);
    this.rule = rule;
    this.name = 'BusinessRuleError';
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfter?: number;

  constructor(message: string = 'Too many requests', retryAfter?: number) {
    super(message, 429);
    this.retryAfter = retryAfter;
    this.name = 'RateLimitError';
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', originalError?: Error) {
    super(message, 500, false);
    this.name = 'InternalServerError';
    
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

export class ExternalServiceError extends AppError {
  public readonly service: string;

  constructor(service: string, message?: string) {
    super(message || `External service '${service}' is unavailable`, 502);
    this.service = service;
    this.name = 'ExternalServiceError';
  }
}

export class TimeoutError extends AppError {
  public readonly operation: string;
  public readonly timeout: number;

  constructor(operation: string, timeout: number) {
    super(`Operation '${operation}' timed out after ${timeout}ms`, 504);
    this.operation = operation;
    this.timeout = timeout;
    this.name = 'TimeoutError';
  }
}
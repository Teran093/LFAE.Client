export class AppError extends Error {
  private handled = false;

  constructor(
    message: string,
    public code: AppErrorCode = 'UNKNOWN_ERROR',
    public isOperational?: boolean,
    cause?: unknown,
  ) {
    super(message, { cause: cause });
  }

  public get isHandled(): boolean {
    return this.handled;
  }

  public markAsHandled(): this {
    this.handled = true;
    return this;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, isOperational = true) {
    super(message, 'VALIDATION_ERROR', isOperational);
  }
}

export type AppErrorCode = HttpErrorCode | 'UNKNOWN_ERROR' | 'VALIDATION_ERROR';

export type HttpErrorCode =
  'NETWORK_ERROR' | 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'SERVER_ERROR';

export const ERROR_MESSAGES: Record<AppErrorCode, string> = {
  UNKNOWN_ERROR: 'Something went wrong. Please try again later.',
  VALIDATION_ERROR: 'Please check the information you entered and try again.',
  NETWORK_ERROR: 'Unable to connect to the server. Please try again later.',
  BAD_REQUEST: 'The request could not be processed.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource could not be found.',
  SERVER_ERROR: 'Something went wrong on the server. Please try again later.',
};

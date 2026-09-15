export class AppError extends Error {
  /** Whether this error has already been handled (e.g. logged/notified by an interceptor),
   *  so downstream handlers like GlobalErrorHandler know to skip it. */
  private handled = false;

  constructor(
    message: string,
    /** Machine-readable error category, used to look up the user-facing message. */
    public code: AppErrorCode = 'UNKNOWN_ERROR',
    /** True if this is an expected/anticipated failure (e.g. validation, 404) as opposed
     *  to a programming bug or unexpected exception. Useful for deciding log severity. */
    public isOperational?: boolean,
    /** The original error/exception that triggered this one, preserved for debugging. */
    cause?: unknown,
  ) {
    super(message, { cause: cause });
  }
  /** Read-only accessor exposing whether the error has been marked as handled. */
  public get isHandled(): boolean {
    return this.handled;
  }
  /** Marks the error as handled so it won't be reprocessed (e.g. by GlobalErrorHandler). */
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

/** All possible error codes: HTTP-specific ones plus generic app-level ones. */
export type AppErrorCode = HttpErrorCode | 'UNKNOWN_ERROR' | 'VALIDATION_ERROR';

/** Error codes specific to HTTP request failures, mapped from response status codes. */
export type HttpErrorCode =
  'NETWORK_ERROR' | 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'SERVER_ERROR';

/** User-facing message for each error code, shown via the notification service. */
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

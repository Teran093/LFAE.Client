export class AppError extends Error {
  /** Indicates if the error was handled to prevent duplicate notifications or logs. */
  private handled = false;

  constructor(
    message: string,
    /** Machine-readable code from backend or HTTP fallback. */
    public code: AppErrorCode = 'UNKNOWN_ERROR',
    /** True for expected failure (4xx, validation); false for unhandled bugs (5xx, crashes). */
    public isOperational = true,
    /** Field-level validation errors mapped by field name. */
    public fieldErrors?: Record<string, string>,
    /** Underlying exception preserved for debugging. */
    cause?: unknown,
  ) {
    super(message, { cause });
  }

  /** Returns whether the error has been processed. */
  public get isHandled(): boolean {
    return this.handled;
  }

  /** Flags the error as processed. */
  public markAsHandled(): this {
    this.handled = true;
    return this;
  }
}

/** Predefined frontend error codes for IDE autocompletion. */
export type KnownErrorCode =
  | 'UNKNOWN_ERROR'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND';

/** Known error code autocomplete with support for dynamic backend codes. */
export type AppErrorCode = KnownErrorCode | (string & {});

/** Maps error codes to i18n translation keys. */
export const ERROR_I18N_KEYS: Record<string, string> = {
  UNKNOWN_ERROR: 'ERRORS.UNKNOWN',
  VALIDATION_ERROR: 'ERRORS.VALIDATION',
  NETWORK_ERROR: 'ERRORS.NETWORK',
  UNAUTHORIZED: 'ERRORS.UNAUTHORIZED',
  FORBIDDEN: 'ERRORS.FORBIDDEN',
  NOT_FOUND: 'ERRORS.NOT_FOUND',
  SERVER_ERROR: 'ERRORS.SERVER',
  EVENT_INVALID_DATES: 'ERRORS.EVENT_INVALID_DATES',
};

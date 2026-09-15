import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { LoggerService } from '../services/logger.service';
import { NotificationService } from '../services/notification.service';
import { AppError, AppErrorCode, ERROR_MESSAGES } from '../errors/app-error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const notifier = inject(NotificationService);

  return next(req).pipe(
    tap({
      error: (error) => {
        logger.logError(error);
        const errorCode = getHttpAppErrorCode(error);
        notifier.showError(ERROR_MESSAGES[errorCode]);
      },
    }),
    catchError((error) => {
      const errorCode = getHttpAppErrorCode(error);
      const appError = new AppError(
        error instanceof Error ? error.message : 'Error HTTP desconocido',
        errorCode,
        true,
        error,
      );
      appError.markAsHandled();

      return throwError(() => appError);
    }),
  );
};

function getHttpAppErrorCode(error: any): AppErrorCode {
  switch (error.status) {
    case 0:
      return 'NETWORK_ERROR';
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'SERVER_ERROR';
    default:
      return 'UNKNOWN_ERROR';
  }
}

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppError } from '../errors/app-error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        // Connection error or no response from server (Status code 0)
        if (error.status === 0) {
          return throwError(
            () => new AppError('No server connection', 'NETWORK_ERROR', true, undefined, error),
          );
        }

        // Extracting formatted data from Spring Boot's ProblemDetail
        const problemBody = error.error;
        const errorCode = problemBody?.code || mapHttpStatusToCode(error.status);
        const detailMessage = problemBody?.detail || error.message;
        const fieldErrors = problemBody?.fieldErrors;

        const appError = new AppError(
          detailMessage,
          errorCode,
          error.status < 500,
          fieldErrors,
          error,
        );
        return throwError(() => appError);
      }

      return throwError(
        () => new AppError('Unknown client error', 'UNKNOWN_ERROR', false, undefined, error),
      );
    }),
  );
};

function mapHttpStatusToCode(status: number): string {
  switch (status) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    default:
      return 'SERVER_ERROR';
  }
}

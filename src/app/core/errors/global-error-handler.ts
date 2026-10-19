import { ErrorHandler, inject, Injectable } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { NotificationService } from '../services/notification.service';
import { AppError } from './app-error';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private logger = inject(LoggerService);
  private notifier = inject(NotificationService);

  public handleError(error: unknown): void {
    if (error instanceof AppError && error.isHandled) {
      return;
    }

    this.logger.logError(error);

    if (error instanceof AppError) {
      this.notifier.showErrorByCode(error.code, error.message);
      error.markAsHandled();
    } else if (error instanceof Error) {
      this.notifier.showError(error.message);
    } else {
      this.notifier.showErrorByCode('UNKNOWN_ERROR');
    }
  }
}

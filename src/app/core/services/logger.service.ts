import { Service } from '@angular/core';
import { AppError } from '../errors/app-error';

@Service()
export class LoggerService {
  public logError(error: unknown): void {
    if (error instanceof AppError) {
      if (error.isOperational) {
        console.warn(`[Operational Error]: ${error.code} - ${error.message}`, error);
      } else {
        console.error(`[System Error]: ${error.code}`, error);
      }
      return;
    }
    console.error('[Unhandled Exception]', error);
  }
}

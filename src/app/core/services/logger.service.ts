import { Service } from '@angular/core';
import { AppError } from '../errors/app-error';

@Service()
export class LoggerService {
  public logError(error: unknown) {
    if (error instanceof Error) {
      if (error instanceof AppError) {
        console.error(error.code ?? 'Aplication', { error });
        return;
      }
      console.error({ error });
    }
  }
}

import { Service } from '@angular/core';
import { ERROR_I18N_KEYS } from '../errors/app-error';

@Service()
export class NotificationService {
  public showErrorByCode(errorCode: string, fallbackMessage?: string): void {
    const i18nKey = ERROR_I18N_KEYS[errorCode] || 'ERRORS.UNKNOWN';
    // TODO: Integrate with a real i18n library (Transloco, ngx-translate, etc.) to fetch the translated message.
    const translatedMessage = this.translateKey(i18nKey, fallbackMessage);

    this.displayToast(translatedMessage);
  }

  public showError(message: string): void {
    this.displayToast(message);
  }

  private displayToast(message: string): void {
    // TODO: Replace this with a real toast/notification library (e.g., Angular Material Snackbar, ngx-toastr, etc.)
    alert(`[Notificación]: ${message}`);
  }

  private translateKey(key: string, fallback?: string): string {
    // Simplified translation mechanism for demonstration purposes.
    // TODO: fetch translations from a proper i18n library or service.
    const mockTranslations: Record<string, string> = {
      'ERRORS.UNKNOWN': 'An unexpected error occurred.',
      'ERRORS.NETWORK': 'No connection to the server. Please check your internet connection.',
      'ERRORS.NOT_FOUND': 'The requested resource does not exist.',
      'ERRORS.EVENT_INVALID_DATES': 'The end date cannot be earlier than the start date.',
      'ERRORS.VALIDATION': 'Please review the entered data.',
    };
    return mockTranslations[key] || fallback || 'Unknown error';
  }
}

import { Service } from '@angular/core';

@Service()
export class NotificationService {
  public showError(message: string) {
    // Temporary: use the browser's alert dialog to display the error.
    // TODO: Use our own component to show the error.
    alert(`Error: ${message}`);
  }
}

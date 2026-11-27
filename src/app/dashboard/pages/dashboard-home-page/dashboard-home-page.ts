import { Component, computed, ErrorHandler, inject, linkedSignal, signal } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';
import { Select } from '../../../shared/components/select/select';
import { Language, LanguageUpdate } from '../../../shared/models/language.model';
import { SelectOption } from '../../../shared/components/select-option/select-option';
import { Checkbox } from '../../../shared/components/checkbox/checkbox';
import { Button } from '../../../shared/components/button/button';
import { AppIconName } from '../../../shared/directives/icon.directive';

/** Dashboard start page. For now it only manages the site languages. */
@Component({
  imports: [Select, SelectOption, Checkbox, Button],
  selector: 'app-dashboard-home-page',
  styleUrl: './dashboard-home-page.css',
  templateUrl: './dashboard-home-page.html',
})
export class DashboardHomePage {
  private readonly lang = inject(LanguageService);
  private readonly errorHandler = inject(ErrorHandler);
  protected readonly languages = this.lang.languages;

  protected readonly selectedLangCode = signal<string | undefined>(undefined);

  /** The selected language, exactly as saved in the API. */
  protected readonly currentLang = computed(() => {
    if (!this.languages.hasValue()) {
      return undefined;
    }
    return this.languages.value().find((language) => language.code === this.selectedLangCode());
  });

  /**
   * Unsaved copy of the selected language's settings, edited by the checkboxes.
   * Resets to the saved values when another language is selected or the list reloads.
   */
  protected readonly draft = linkedSignal(() => this.toUpdate(this.currentLang()));

  protected readonly hasChanges = computed(() => {
    const saved = this.toUpdate(this.currentLang());
    const draft = this.draft();
    return (
      !!saved && !!draft && (saved.active !== draft.active || saved.isDefault !== draft.isDefault)
    );
  });

  protected readonly isSaving = signal(false);

  /** Flag icon for each language code. */
  public readonly langIcons: Record<string, AppIconName> = {
    en: 'englishLanguageIcon',
    es: 'spanishLanguageIcon',
    pt: 'portugueseLanguageIcon',
    de: 'germanLanguageIcon',
    it: 'italianLanguageIcon',
    fr: 'frenchLanguageIcon',
  };

  protected setDraft(field: keyof LanguageUpdate, value: boolean): void {
    this.draft.update((draft) => (draft ? { ...draft, [field]: value } : draft));
  }

  /** Discards the unsaved changes. */
  protected reset(): void {
    this.draft.set(this.toUpdate(this.currentLang()));
  }

  /** Saves the selected language's settings. */
  protected save(): void {
    const language = this.currentLang();
    const draft = this.draft();
    if (!language || !draft) {
      return;
    }

    this.isSaving.set(true);
    this.lang.update(language.code, draft).subscribe({
      // The service reloads the list, which also resets the draft to the saved values
      next: () => this.isSaving.set(false),
      // The interceptor already turned it into an AppError with the backend's code and message
      error: (error: unknown) => {
        this.isSaving.set(false);
        this.errorHandler.handleError(error);
      },
    });
  }

  /** Copies only the editable settings, so editing the draft never changes the loaded list. */
  private toUpdate(language: Language | undefined): LanguageUpdate | undefined {
    return language ? { active: language.active, isDefault: language.isDefault } : undefined;
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';
import { Select } from '../../../shared/components/select/select';
import { LanguageUpdate } from '../../../shared/models/language.model';
import { SelectOption } from '../../../shared/components/select-option/select-option';
import { Checkbox } from '../../../shared/components/checkbox/checkbox';
import { Button } from '../../../shared/components/button/button';
import { AppIconName } from '../../../shared/directives/icon.directive';
import { AppError } from '../../../core/errors/app-error';

@Component({
  imports: [Select, SelectOption, Checkbox, Button],
  selector: 'app-dashboard-home-page',
  styleUrl: './dashboard-home-page.css',
  templateUrl: './dashboard-home-page.html',
})
export class DashboardHomePage {
  private readonly lang = inject(LanguageService);
  protected readonly languages = this.lang.languages;

  protected readonly selectedLangCode = signal<string | undefined>(undefined);
  protected readonly currentLang = computed(() =>
    this.languages.value().find((language) => language.code === this.selectedLangCode()),
  );

  public readonly langIcons: Record<string, AppIconName> = {
    en: 'englishLanguageIcon' as AppIconName,
    es: 'spanishLanguageIcon' as AppIconName,
    pt: 'portugueseLanguageIcon' as AppIconName,
    de: 'germanLanguageIcon' as AppIconName,
    it: 'italianLanguageIcon' as AppIconName,
    fr: 'frenchLanguageIcon' as AppIconName,
  };

  protected languageConfigChanged() {
    const language = this.currentLang();

    if (!language) {
      return;
    }

    const langUpdate: LanguageUpdate = {
      active: language.active,
      isDefault: language.isDefault,
    };

    this.lang.update(language.code, langUpdate).subscribe({
      error: (error) => {
        throw new AppError(error.message, 'SERVER_ERROR');
      },
    });
  }
}

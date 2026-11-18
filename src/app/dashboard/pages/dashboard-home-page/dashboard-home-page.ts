import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';
import { Select } from '../../../shared/components/select/select';
import { Language } from '../../../shared/models/language.model';
import { SelectOption } from '../../../shared/components/select-option/select-option';

@Component({
  imports: [Select, SelectOption],
  selector: 'app-dashboard-home-page',
  styleUrl: './dashboard-home-page.css',
  templateUrl: './dashboard-home-page.html',
})
export class DashboardHomePage {
  protected readonly languages = inject(LanguageService).languages;
  protected currentLang?: Language;
}

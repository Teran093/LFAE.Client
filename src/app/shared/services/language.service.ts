import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Language, LanguageUpdate } from '../models/language.model';
import { tap } from 'rxjs';

@Service()
export class LanguageService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/languages';
  // TODO: Set the default to english but with a type
  private readonly displayLang = signal<string | undefined>(undefined);

  public readonly languages = httpResource<Language[]>(
    () => {
      const lang = this.displayLang();
      const params: Record<string, string | boolean> = { onlyActives: false };
      if (lang) {
        params['lang'] = lang;
      }
      return { url: this.url, params };
    },
    { defaultValue: [] },
  );

  public readonly activeLanguages = computed(() =>
    this.languages.hasValue() ? this.languages.value().filter((l) => l.active) : [],
  );

  public update(code: string, body: LanguageUpdate) {
    const updateUrl = `${this.url}/${code}`;
    return this.http.put<void>(updateUrl, body).pipe(tap(() => this.languages.reload()));
  }
}

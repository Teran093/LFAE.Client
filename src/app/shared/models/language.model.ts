/** A site language, as returned by the API. */
export interface Language {
  /** ISO 639-1 code, e.g. "en", "pt". */
  code: string;
  name: string;
  /** Whether visitors can choose this language. */
  active: boolean;
  /** Language used when the visitor hasn't chosen one. */
  isDefault: boolean;
}

/** Body sent to the API to change a language's settings. */
export interface LanguageUpdate {
  active: boolean;
  isDefault: boolean;
}

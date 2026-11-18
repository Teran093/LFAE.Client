export interface Language {
  code: string;
  name: string;
  active: boolean;
  isDefault: boolean;
}

export interface LanguageUpdate {
  active: boolean;
  isDefault: boolean;
}

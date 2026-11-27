import englishLanguageIcon from '../icons/language-icon-en.svg';
import spanishLanguageIcon from '../icons/language-icon-es.svg';
import portugueseLanguageIcon from '../icons/language-icon-pt.svg';
import germanLanguageIcon from '../icons/language-icon-de.svg';
import italianLanguageIcon from '../icons/language-icon-it.svg';
import frenchLanguageIcon from '../icons/language-icon-fr.svg';

/**
 * Custom SVG icons bundled with the app. The key is the name used in templates:
 *   <span appIcon="englishLanguageIcon"></span>
 * Keys must not match a key of NG_ICON_LIST: if they do, the library icon wins.
 */
export const CUSTOM_ICON_LIST = {
  englishLanguageIcon,
  spanishLanguageIcon,
  portugueseLanguageIcon,
  germanLanguageIcon,
  italianLanguageIcon,
  frenchLanguageIcon,
};
export type CustomIconName = keyof typeof CUSTOM_ICON_LIST;

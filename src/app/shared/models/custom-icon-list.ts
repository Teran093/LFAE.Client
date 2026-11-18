// Example (SVG files live in shared/icons/):
// import churchLogo from '../icons/church-logo.svg';

/**
 * Custom SVG icons bundled with the app. The key is the name used in the template:
 *   <span appIcon="church-logo"></span>
 * Use kebab-case keys so they never clash with the camelCase keys of NG_ICON_LIST.
 */
export const CUSTOM_ICON_LIST = {
  // 'church-logo': churchLogo,
};
export type CustomIconName = keyof typeof CUSTOM_ICON_LIST;

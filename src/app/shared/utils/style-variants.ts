import { Align, BorderRadius, VariantSize } from '../models/variants.types';

const RADIUS_MAP: Record<BorderRadius, string> = {
  none: 'rounded-none',
  small: 'rounded-sm',
  default: 'rounded',
  medium: 'rounded-md',
  large: 'rounded-lg',
  full: 'rounded-full',
};

const JUSTIFY_MAP: Record<Align, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
};

const ITEMS_MAP: Record<Align, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
};

/** Icon size in px for each component size, so icons scale together with the text. */
export const ICON_SIZE_MAP: Record<VariantSize, number> = {
  small: 14,
  medium: 16,
  large: 20,
};

/**
 * Variant configuration interface used to change the styles of the components in the project
 */
export interface VariantConfig {
  prefix: string; // 'ctrl' | 'select-menu' | 'select-option' | 'checkbox'
  style?: string; // optional: without style, no role or outline classes are added
  outline?: boolean;
  size?: string;
  rounded?: BorderRadius;
  align?: Align;
  alignMode?: 'justify' | 'items';
  display?: 'inline-flex' | 'flex';
}

/**
 * Builds the list of CSS classes of a component:
 *   [display] {prefix}-base role-{style} [{prefix}-outline] {prefix}-size-{size} [rounded] [align]
 * The CSS of each prefix lives in styles/controls.css (ctrl) or in the component's own CSS.
 */
export function buildVariantClasses(cfg: VariantConfig): string[] {
  const classes: string[] = [];

  if (cfg.display) {
    classes.push(...(cfg.display === 'inline-flex' ? ['inline-flex'] : ['flex', 'size-full']));
  }

  classes.push(`${cfg.prefix}-base`);

  if (cfg.style) {
    classes.push(`role-${cfg.style}`);
  }
  if (cfg.outline) {
    classes.push(`${cfg.prefix}-outline`);
  }
  if (cfg.size) {
    classes.push(`${cfg.prefix}-size-${cfg.size}`);
  }
  if (cfg.rounded) {
    classes.push(RADIUS_MAP[cfg.rounded]);
  }
  if (cfg.align) {
    classes.push((cfg.alignMode === 'items' ? ITEMS_MAP : JUSTIFY_MAP)[cfg.align]);
  }

  return classes;
}

// shared/style-variants.ts
export type BorderRadius = 'none' | 'small' | 'default' | 'medium' | 'large' | 'full';
export type Align = 'start' | 'center' | 'end';

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

/**
 * Variant configuration interface used to change the styles of the components in the proyect
 */
export interface VariantConfig {
  prefix: string; // 'btn' | 'select' | 'select-menu' | 'select-option'
  style: string;
  outline?: boolean;
  size?: string;
  rounded?: BorderRadius;
  align?: Align;
  alignMode?: 'justify' | 'items'; // justify para flex-row, items para flex-col
  display?: 'inline-flex' | 'flex';
}

export function buildVariantClasses(cfg: VariantConfig): string[] {
  const classes: string[] = [];

  if (cfg.display) {
    classes.push(...(cfg.display === 'inline-flex' ? ['inline-flex'] : ['flex', 'size-full']));
  }

  classes.push(`${cfg.prefix}-base`, `role-${cfg.style}`); // 👈 agregado

  classes.push(
    ...(cfg.outline
      ? [`${cfg.prefix}-outline`, `${cfg.prefix}-outline-${cfg.style}`]
      : [`${cfg.prefix}-${cfg.style}`]),
  );

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

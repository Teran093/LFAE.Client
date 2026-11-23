import { computed, Directive, input } from '@angular/core';
import { BorderRadius, VariantSize, VariantStyle } from '../models/variants.types';
import { ICON_SIZE_MAP, VariantConfig } from '../utils/style-variants';

/**
 * Shared visual base for Button, Select, Checkbox...
 * @Directive() is required so Angular processes the input() fields of an abstract class.
 *
 * To create a new component: extend this class, set `prefix`, and build the classes with
 * buildVariantClasses({ ...this.variantConfig(), prefix: this.prefix }).
 */
@Directive()
export abstract class VariantBase {
  /** CSS class prefix of the component: 'ctrl' (Button, Select) | 'checkbox' */
  protected abstract readonly prefix: string;

  public disabled = input<boolean>(false);
  public variant = input<VariantStyle>('primary');
  public size = input<VariantSize>('medium');
  public rounded = input<BorderRadius>('default');
  public outline = input<boolean>(false);

  /** Common config; each component adds its own prefix, align, display... */
  protected variantConfig = computed<Omit<VariantConfig, 'prefix'>>(() => ({
    style: this.variant(),
    outline: this.outline(),
    size: this.size(),
    rounded: this.rounded(),
  }));

  /** Icon size (px) that matches the component size. */
  protected iconSize = computed(() => ICON_SIZE_MAP[this.size()]);
}

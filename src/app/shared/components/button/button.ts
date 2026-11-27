import { Component, computed, input, output } from '@angular/core';
import { MenuOption } from '../menu/menu-option';
import { OverlayDirective } from '../../directives/overlay.directive';
import { Menu } from '../menu/menu';
import { Align } from '../../models/variants.types';
import { VariantBase } from '../../bases/variant-base';
import { buildVariantClasses } from '../../utils/style-variants';

/** Styled button. If `menuOptions` is set, clicking it opens a dropdown menu. */
@Component({
  imports: [OverlayDirective, Menu],
  selector: 'app-button',
  styleUrl: './button.css',
  templateUrl: './button.html',
})
export class Button extends VariantBase {
  protected readonly prefix = 'ctrl';

  public active = input<boolean>(false);
  /** Horizontal alignment of the content. */
  public align = input<Align>('center');
  public tabindex = input<number>(-1);
  /** Options of the dropdown menu. Without options, it's a plain button. */
  public menuOptions = input<MenuOption[]>();
  public menuPlaceholder = input<string>();

  public clicked = output<void | MouseEvent>();

  protected classes = computed(() =>
    buildVariantClasses({
      ...this.variantConfig(),
      prefix: this.prefix,
      align: this.align(),
    }),
  );
}

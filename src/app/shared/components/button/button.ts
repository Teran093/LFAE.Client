import { Component, computed, input, output } from '@angular/core';
import { MenuOption } from '../menu/menu-option';
import { OverlayDirective } from '../../directives/overlay.directive';
import { Menu } from '../menu/menu';
import { Align } from '../../models/variants.types';
import { VariantBase } from '../../bases/variant-base';
import { buildVariantClasses } from '../../utils/style-variants';

@Component({
  imports: [OverlayDirective, Menu],
  selector: 'app-button',
  styleUrl: './button.css',
  templateUrl: './button.html',
})
export class Button extends VariantBase {
  protected readonly prefix = 'ctrl';

  public active = input<boolean>(false);
  public align = input<Align>('center');
  public tabindex = input<number>(-1);
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

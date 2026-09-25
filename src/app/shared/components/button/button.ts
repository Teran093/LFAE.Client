import { Component, computed, input, output } from '@angular/core';
import { MenuOption } from '../menu/menu-option';
import { OverlayDirective } from '../../directives/overlay.directive';
import { Menu } from '../menu/menu';
import { buildVariantClasses } from '../../utils/style-variants';

@Component({
  imports: [OverlayDirective, Menu],
  selector: 'app-button',
  styleUrl: './button.css',
  templateUrl: './button.html',
})
export class Button {
  public active = input<boolean>(false);
  public disabled = input<boolean>(false);
  public align = input<ButtonAlignment>('center');
  public buttonStyle = input<ButtonStyle>('primary');
  public size = input<'small' | 'medium' | 'large'>('medium');
  public rounded = input<ButtonBorderRadius>('default');
  public outline = input<boolean>(false);
  public display = input<'inline-flex' | 'flex'>('flex');
  public tabindex = input<number>(-1);
  public menuOptions = input<MenuOption[]>();
  public menuPlaceholder = input<string>();

  public clicked = output<void | MouseEvent>();

  protected classes = computed(() =>
    buildVariantClasses({
      prefix: 'btn',
      style: this.buttonStyle(),
      outline: this.outline(),
      size: this.size(),
      rounded: this.rounded(),
      align: this.align(),
      display: this.display(),
    }),
  );
}

export type ButtonStyle = 'primary' | 'secondary' | 'tertiary' | 'surface';

export type ButtonBorderRadius = 'none' | 'small' | 'default' | 'medium' | 'large' | 'full';

export type ButtonAlignment = 'start' | 'center' | 'end';

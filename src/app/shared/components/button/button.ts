import { Component, computed, input, output } from '@angular/core';
import { MenuOption } from '../menu/menu-option';
import { OverlayDirective } from '../../directives/overlay.directive';
import { Menu } from '../menu/menu';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  imports: [OverlayDirective, Menu, NgTemplateOutlet],
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

  protected classes = computed(() => {
    const base = 'btn-base';

    const radiusMap: Record<ButtonBorderRadius, string> = {
      none: 'rounded-none',
      small: 'rounded-sm',
      default: 'rounded',
      medium: 'rounded-md',
      large: 'rounded-lg',
      full: 'rounded-full',
    };

    const internalDisplay =
      this.display() == 'inline-flex' ? ['inline-flex'] : ['flex', 'size-full'];

    const btnStyle = this.outline()
      ? ['btn-outline', `btn-outline-${this.buttonStyle()}`]
      : [`btn-${this.buttonStyle()}`];

    const btnSize = `btn-size-${this.size()}`;

    const alignMap: Record<ButtonAlignment, string> = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    };

    return [
      ...internalDisplay,
      base,
      ...btnStyle,
      radiusMap[this.rounded()],
      btnSize,
      alignMap[this.align()],
    ];
  });
}

export type ButtonStyle = 'primary' | 'secondary' | 'tertiary' | 'surface';

export type ButtonBorderRadius = 'none' | 'small' | 'default' | 'medium' | 'large' | 'full';

export type ButtonAlignment = 'start' | 'center' | 'end';

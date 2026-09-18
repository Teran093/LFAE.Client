import { Component, computed, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-button',
  styleUrl: './button.css',
  templateUrl: './button.html',
})
export class Button {
  public active = input<boolean>(false);
  public disabled = input<boolean>(false);
  public align = input<'start' | 'center' | 'end'>('center');
  public buttonStyle = input<ButtonStyle>('primary');
  public size = input<'small' | 'medium' | 'large'>('medium');
  public rounded = input<ButtonBorderRadius>('default');
  public outline = input<boolean>(false);
  public display = input<'inline-flex' | 'flex'>('flex');
  public tabindex = input<number>(-1);

  public clicked = output<void>();

  protected classes = computed(() => {
    const base = 'app-btn-base';

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
      ? ['btn-outline', `app-btn-outline-${this.buttonStyle()}`]
      : [`app-btn-${this.buttonStyle()}`];

    const btnSize = `btn-size-${this.size()}`;

    const btnAlign = `justify-${this.align()}`;

    return [...internalDisplay, base, ...btnStyle, radiusMap[this.rounded()], btnSize, btnAlign];
  });
}

export type ButtonStyle = 'primary' | 'secondary' | 'tertiary' | 'navbar' | 'surface';

export type ButtonBorderRadius = 'none' | 'small' | 'default' | 'medium' | 'large' | 'full';

import { Component, computed, contentChildren, effect, input, model, signal } from '@angular/core';
import { SelectOption } from '../select-option/select-option';
import { OverlayDirective } from '../../directives/overlay.directive';

@Component({
  imports: [OverlayDirective],
  selector: 'app-select',
  styleUrl: './select.css',
  templateUrl: './select.html',
})
export class Select<T> {
  // Options list
  protected selectOptions = contentChildren(SelectOption);

  // Inputs
  public currentValue = model<T | undefined>();
  public placeholder = input<string>('Select an option...');
  public disabled = input<boolean>(false);
  public align = input<InputAlign>('center');
  public selectStyle = input<InputStyle>('primary');
  public size = input<'small' | 'medium' | 'large'>('medium');
  public rounded = input<InputBorderRadius>('default');
  public outline = input<boolean>(false);
  public display = input<'inline-flex' | 'flex'>('flex');

  protected currentOption = signal<SelectOption<T> | undefined>(undefined);

  protected classes = computed(() => {
    const base = 'select-base';

    const radiusMap: Record<InputBorderRadius, string> = {
      none: 'rounded-none',
      small: 'rounded-sm',
      default: 'rounded',
      medium: 'rounded-md',
      large: 'rounded-lg',
      full: 'rounded-full',
    };

    const internalDisplay =
      this.display() == 'inline-flex' ? ['inline-flex'] : ['flex', 'size-full'];

    const selectStyle = this.outline()
      ? ['select-outline', `select-outline-${this.selectStyle()}`]
      : [`select-${this.selectStyle()}`];

    const selectSize = `select-size-${this.size()}`;

    const alignMap: Record<InputAlign, string> = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    };

    return [
      ...internalDisplay,
      base,
      ...selectStyle,
      radiusMap[this.rounded()],
      selectSize,
      alignMap[this.align()],
    ];
  });

  protected menuClasses = computed(() => {
    const baseMenu = 'select-menu-base';

    const radiusMap: Record<InputBorderRadius, string> = {
      none: 'rounded-none',
      small: 'rounded-sm',
      default: 'rounded',
      medium: 'rounded-md',
      large: 'rounded-lg',
      full: 'rounded-full',
    };

    const internalDisplay =
      this.display() == 'inline-flex' ? ['inline-flex'] : ['flex', 'size-full'];

    const selectMenuStyle = this.outline()
      ? ['select-menu-outline', `select-menu-outline-${this.selectStyle()}`]
      : [`select-menu-${this.selectStyle()}`];

    const selectMenuSize = `select-menu-size-${this.size()}`;

    const alignMenuMap: Record<InputAlign, string> = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
    };

    return [
      ...internalDisplay,
      baseMenu,
      ...selectMenuStyle,
      radiusMap[this.rounded()],
      selectMenuSize,
      alignMenuMap[this.align()],
    ];
  });

  constructor() {
    effect(() => {
      const options = this.selectOptions();
      if (options.length === 0) {
        return;
      }
      const value = this.currentValue();
      this.currentOption.set(options.find((option) => option.value() === value));
      if (!this.currentOption()) {
        this.currentValue.set(undefined);
      }
    });

    effect((onCleanup) => {
      if (this.selectOptions().length === 0) {
        return;
      }

      this.selectOptions().forEach((option) => (option.father = this));

      const subscriptions = this.selectOptions().map((option) =>
        option.optionClicked.subscribe((value) => {
          if (!option.disabled()) {
            this.currentValue.set(value);
            this.currentOption.set(option);
          }
        }),
      );
      onCleanup(() => subscriptions.forEach((sub) => sub.unsubscribe()));
    });
  }
}

export type InputAlign = 'start' | 'center' | 'end';
export type InputStyle = 'primary' | 'secondary' | 'tertiary' | 'surface';
export type InputBorderRadius = 'none' | 'small' | 'default' | 'medium' | 'large' | 'full';

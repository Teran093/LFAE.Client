import { Component, computed, contentChildren, effect, input, model, signal } from '@angular/core';
import { SelectOption } from '../select-option/select-option';
import { OverlayDirective } from '../../directives/overlay.directive';
import { buildVariantClasses } from '../../utils/style-variants';

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
  public menuOffset = input<number>(4);

  protected currentOption = signal<SelectOption<T> | undefined>(undefined);

  protected classes = computed(() =>
    buildVariantClasses({
      prefix: 'select',
      style: this.selectStyle(),
      outline: this.outline(),
      size: this.size(),
      rounded: this.rounded(),
      align: this.align(),
      display: this.display(),
    }),
  );

  protected menuClasses = computed(() =>
    buildVariantClasses({
      prefix: 'select-menu',
      style: this.selectStyle(),
      outline: this.outline(),
      size: this.size(),
      rounded: this.rounded(),
      align: this.align(),
      alignMode: 'items',
      display: this.display(),
    }),
  );

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

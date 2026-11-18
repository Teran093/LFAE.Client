import { Component, computed, contentChildren, effect, input, model, signal } from '@angular/core';
import { SelectOption } from '../select-option/select-option';
import { OverlayDirective } from '../../directives/overlay.directive';
import { buildVariantClasses } from '../../utils/style-variants';
import { VariantBase } from '../../bases/variant-base';
import { Align } from '../../models/variants.types';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  imports: [OverlayDirective],
  selector: 'app-select',
  styleUrl: './select.css',
  templateUrl: './select.html',
})
export class Select<T> extends VariantBase implements FormValueControl<T | undefined> {
  // Options list
  protected selectOptions = contentChildren(SelectOption);
  protected readonly prefix = 'select';

  // Inputs
  public value = model<T | undefined>();
  public placeholder = input<string>('Select an option...');
  public align = input<Align>('center');
  public display = input<'inline-flex' | 'flex'>('flex');
  public menuOffset = input<number>(4);

  protected currentOption = signal<SelectOption<T> | undefined>(undefined);

  protected classes = computed(() =>
    buildVariantClasses({
      ...this.variantConfig(),
      prefix: this.prefix,
      align: this.align(),
      display: this.display(),
    }),
  );

  protected menuClasses = computed(() =>
    buildVariantClasses({
      ...this.variantConfig(),
      prefix: `${this.prefix}-menu`,
      align: this.align(),
      alignMode: 'items',
      display: this.display(),
    }),
  );

  constructor() {
    super();

    effect(() => {
      const options = this.selectOptions();
      if (options.length === 0) {
        return;
      }
      const value = this.value();
      this.currentOption.set(options.find((option) => option.value() === value));
      if (!this.currentOption()) {
        this.value.set(undefined);
      }
    });

    effect((onCleanup) => {
      if (this.selectOptions().length === 0) {
        return;
      }

      this.selectOptions().forEach((option) => option.father.set(this));

      const subscriptions = this.selectOptions().map((option) =>
        option.optionClicked.subscribe((value) => {
          if (!option.disabled()) {
            this.value.set(value);
            this.currentOption.set(option);
          }
        }),
      );
      onCleanup(() => subscriptions.forEach((sub) => sub.unsubscribe()));
    });
  }
}

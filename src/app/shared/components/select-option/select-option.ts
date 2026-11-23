import { Component, computed, input, output, signal } from '@angular/core';
import { Select } from '../select/select';
import { buildVariantClasses, ICON_SIZE_MAP } from '../../utils/style-variants';
import { Align } from '../../models/variants.types';
import { IconDirective, IconName } from '../../directives/icon.directive';

@Component({
  imports: [IconDirective],
  selector: 'app-select-option',
  styleUrl: './select-option.css',
  templateUrl: './select-option.html',
})
export class SelectOption<T> {
  public label = input<string>();
  public value = input<T>();
  /** Optional icon shown before the label (also shown in the select button when selected). */
  public icon = input<IconName>();
  public disabled = input<boolean>(false);
  public align = input<Align>();

  public father = signal<Select<T> | undefined>(undefined);

  protected selected = computed(() => {
    const father = this.father();
    return !!father && this.value() !== undefined && father.value() === this.value();
  });

  protected iconSize = computed(() => ICON_SIZE_MAP[this.father()?.size() ?? 'medium']);

  protected classes = computed(() => {
    const father = this.father();
    if (!father) {
      return [];
    }
    return buildVariantClasses({
      prefix: 'select-option',
      size: father.size(),
      align: this.align() ?? father.align(),
    });
  });

  public optionClicked = output<T | undefined>();
}

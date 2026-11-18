import { Component, computed, input, output, signal } from '@angular/core';
import { Select } from '../select/select';
import { buildVariantClasses } from '../../utils/style-variants';
import { Align } from '../../models/variants.types';

@Component({
  imports: [],
  selector: 'app-select-option',
  styleUrl: './select-option.css',
  templateUrl: './select-option.html',
})
export class SelectOption<T> {
  public label = input<string>();
  public value = input<T>();
  public disabled = input<boolean>(false);
  public align = input<Align>();

  public father = signal<Select<T> | undefined>(undefined);

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

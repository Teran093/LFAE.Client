import { Component, computed, input, output } from '@angular/core';
import { InputStyle, Select } from '../select/select';
import { buildVariantClasses } from '../../utils/style-variants';

@Component({
  imports: [],
  selector: 'app-select-option',
  styleUrl: './select-option.css',
  templateUrl: './select-option.html',
})
export class SelectOption<T> {
  public label = input<string | undefined>();
  public value = input<T | undefined>();
  public selectOptionStyle = input<InputStyle | undefined>();
  public disabled = input<boolean>(false);
  public align = input<'start' | 'center' | 'end'>();

  public father?: Select<T>;

  protected classes = computed(() => {
    if (!this.father) {
      return [];
    }
    return buildVariantClasses({
      prefix: 'select-option',
      style: '',
      size: this.father.size(),
      align: this.align() ?? this.father.align(),
    });
  });

  public optionClicked = output<T | undefined>();
}

import { Component, computed, input, output } from '@angular/core';
import { InputAlign, InputStyle, Select } from '../select/select';

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
    const optionBase = 'select-option-base';

    const optionStyle = this.father?.outline()
      ? [
          'select-option-outline',
          `select-option-outline-${this.selectOptionStyle() ?? this.father?.selectStyle()}`,
        ]
      : [`select-option-${this.selectOptionStyle() ?? this.father?.selectStyle()}`];

    const optionSize = `select-option-size-${this.father?.size()}`;

    const alignMap: Record<InputAlign, string> = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    };

    return [optionBase, optionStyle, optionSize, alignMap[this.align() ?? this.father.align()]];
  });

  public optionClicked = output<T | undefined>();
}

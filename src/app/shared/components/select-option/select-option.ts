import { Component, input } from '@angular/core';
import { InputAlign } from '../select/select';

@Component({
  imports: [],
  selector: 'app-select-option',
  styleUrl: './select-option.css',
  templateUrl: './select-option.html',
})
export class SelectOption<T> {
  public value = input<T | undefined>();
  public disabled = input<boolean>(false);
  public align = input<InputAlign>('start');
}

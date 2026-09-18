import { Component, input, QueryList, signal } from '@angular/core';
import { SelectOption } from '../select-option/select-option';

@Component({
  imports: [],
  selector: 'app-select',
  styleUrl: './select.css',
  templateUrl: './select.html',
})
export class Select<T> {
  // Options list
  private options = signal<QueryList<SelectOption<T>> | undefined>(undefined);

  // Inputs
  public currentValue = input<T | undefined>();
  public disabled = input<boolean>(false);
  public align = input<InputAlign>('start');

  // Internal properties
  private currentOption = signal<SelectOption<T> | undefined>(undefined);
}

export type InputAlign = 'start' | 'center' | 'end';

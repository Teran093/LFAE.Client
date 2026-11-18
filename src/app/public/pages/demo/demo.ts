import { Component, signal } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { NgClass } from '@angular/common';
import { Select } from '../../../shared/components/select/select';
import { SelectOption } from '../../../shared/components/select-option/select-option';
import { Checkbox } from '../../../shared/components/checkbox/checkbox';
import { VariantStyle } from '../../../shared/models/variants.types';

@Component({
  imports: [Button, NgClass, Select, SelectOption, Checkbox],
  selector: 'app-demo',
  styleUrl: './demo.css',
  templateUrl: './demo.html',
})
export class Demo {
  protected disable = signal<boolean>(false);
  protected outline = signal<boolean>(false);
  protected size = signal<'small' | 'medium' | 'large'>('medium');
  protected variant = signal<VariantStyle>('primary');
}

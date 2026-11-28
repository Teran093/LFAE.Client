import { Component, signal } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { Select } from '../../../shared/components/select/select';
import { SelectOption } from '../../../shared/components/select-option/select-option';
import { Checkbox } from '../../../shared/components/checkbox/checkbox';
import { VariantSize, VariantStyle } from '../../../shared/models/variants.types';

@Component({
  imports: [Button, Select, SelectOption, Checkbox],
  selector: 'app-demo',
  styleUrl: './demo.css',
  templateUrl: './demo.html',
})
export class Demo {
  protected disable = signal<boolean>(false);
  protected outline = signal<boolean>(false);
  protected size = signal<VariantSize>('medium');
  protected variant = signal<VariantStyle>('primary');

  protected checkboxValue = signal<boolean>(false);
  protected place = signal<string | undefined>(undefined);
}

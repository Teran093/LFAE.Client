import { Component, computed, model } from '@angular/core';
import { VariantBase } from '../../bases/variant-base';
import { FormCheckboxControl } from '@angular/forms/signals';
import { buildVariantClasses } from '../../utils/style-variants';

@Component({
  imports: [],
  selector: 'app-checkbox',
  styleUrl: './checkbox.css',
  templateUrl: './checkbox.html',
})
export class Checkbox extends VariantBase implements FormCheckboxControl {
  protected readonly prefix = 'checkbox';

  public checked = model<boolean>(false);

  protected classes = computed(() =>
    buildVariantClasses({
      ...this.variantConfig(),
      prefix: this.prefix,
      display: 'inline-flex',
    }),
  );

  protected toggle(): void {
    if (!this.disabled()) {
      this.checked.update((value) => !value);
    }
  }
}

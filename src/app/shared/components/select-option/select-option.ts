import { Component, computed, input, output, signal } from '@angular/core';
import { Select } from '../select/select';
import { buildVariantClasses, ICON_SIZE_MAP } from '../../utils/style-variants';
import { Align } from '../../models/variants.types';
import { IconDirective, AppIconName } from '../../directives/icon.directive';

/** An option of `<app-select>`. Only works as a direct child of a Select. */
@Component({
  imports: [IconDirective],
  selector: 'app-select-option',
  styleUrl: './select-option.css',
  templateUrl: './select-option.html',
})
export class SelectOption<T> {
  public label = input<string>();
  public value = input<T>();
  public disabled = input<boolean>(false);
  /** Overrides the Select's alignment for this option. */
  public align = input<Align>();

  /** Optional icon shown before the label. */
  public icon = input<AppIconName>();
  /** Defaults to the icon size that matches the Select's size. */
  public iconSize = input<number | string | undefined>();
  protected currentIconSize = computed(
    () => this.iconSize() ?? ICON_SIZE_MAP[this.father()?.size() ?? 'medium'],
  );
  /** The parent Select. Set by the Select itself, so the option can read its size and value. */
  public father = signal<Select<T> | undefined>(undefined);

  protected selected = computed(() => {
    const father = this.father();
    return !!father && this.value() !== undefined && father.value() === this.value();
  });

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

import {
  Component,
  computed,
  contentChildren,
  effect,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { SelectOption } from '../select-option/select-option';
import { OverlayDirective } from '../../directives/overlay.directive';
import { IconDirective } from '../../directives/icon.directive';
import { buildVariantClasses } from '../../utils/style-variants';
import { VariantBase } from '../../bases/variant-base';
import { Align } from '../../models/variants.types';

/**
 * Dropdown select. Options are `<app-select-option>` children.
 * Use `[(value)]` or bind it to a Signal Forms field.
 */
@Component({
  imports: [OverlayDirective, IconDirective],
  selector: 'app-select',
  styleUrl: './select.css',
  templateUrl: './select.html',
})
export class Select<T> extends VariantBase implements FormValueControl<T | undefined> {
  protected selectOptions = contentChildren(SelectOption);

  // The trigger shares its look with Button (see styles/controls.css)
  protected readonly prefix = 'ctrl';

  public value = model<T | undefined>();
  public placeholder = input<string>('Select an option...');
  /** Horizontal alignment of the content of each option. */
  public align = input<Align>('start');
  /** Gap in px between the trigger and the menu. */
  public menuOffset = input<number>(4);

  protected currentOption = signal<SelectOption<T> | undefined>(undefined);

  // The overlay directive placed on the trigger button. It owns the open/close state.
  private overlay = viewChild(OverlayDirective);

  /** True while the menu is open and not yet closing. Drives the arrow rotation. */
  protected isOpen = computed(() => {
    const overlay = this.overlay();
    return !!overlay && overlay.isOpen() && !overlay.isClosing();
  });

  /** Width of the trigger, so the menu is never narrower than the button. */
  protected menuMinWidth = signal<number | undefined>(undefined);

  protected classes = computed(() =>
    buildVariantClasses({
      ...this.variantConfig(),
      prefix: this.prefix,
    }),
  );

  // The menu has no size classes: its rows get their size from each option
  protected menuClasses = computed(() =>
    buildVariantClasses({
      prefix: 'select-menu',
      style: this.variant(),
      outline: this.outline(),
      rounded: this.rounded(),
    }),
  );

  constructor() {
    super();

    // Keep the displayed option in sync with `value`. An unknown value resets it to empty.
    effect(() => {
      const options = this.selectOptions();
      if (options.length === 0) {
        return;
      }
      const value = this.value();
      this.currentOption.set(options.find((option) => option.value() === value));
      if (!this.currentOption()) {
        this.value.set(undefined);
      }
    });

    // Connect each option to this Select and listen to its clicks.
    // Runs again when the options change, removing the old subscriptions first.
    effect((onCleanup) => {
      if (this.selectOptions().length === 0) {
        return;
      }

      this.selectOptions().forEach((option) => option.father.set(this));

      const subscriptions = this.selectOptions().map((option) =>
        option.optionClicked.subscribe((value) => {
          if (!option.disabled()) {
            this.value.set(value);
            this.currentOption.set(option);
            // Clicks inside the menu are not "outside clicks", so close it manually
            this.overlay()?.close();
          }
        }),
      );
      onCleanup(() => subscriptions.forEach((sub) => sub.unsubscribe()));
    });
  }
}

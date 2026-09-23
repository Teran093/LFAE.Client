import { Component, input, output, signal } from '@angular/core';
import { MenuOption } from './menu-option';
import { OverlayDirective } from '../../directives/overlay.directive';

@Component({
  imports: [OverlayDirective],
  selector: 'app-menu',
  styleUrl: './menu.css',
  templateUrl: './menu.html',
})
export class Menu {
  public menuOptions = input.required<MenuOption[]>();
  public selected = output<MenuOption>();
  public placeholder = input<string>();

  protected activeChild = signal<MenuOption | undefined>(undefined);
  protected activeChildOptions = signal<MenuOption[] | undefined>(undefined);

  protected onOptionClick(option: MenuOption) {
    if (option.disabled || option.children?.length) {
      return;
    }
    option.action?.();
    this.selected.emit(option);
  }

  protected async onPointerEnter(option: MenuOption) {
    if (option.disabled) {
      return;
    }
    if (!option.children?.length && !option.getChildren) {
      return;
    }
    this.activeChild.set(option);
    const children = option.children ?? (await option.getChildren?.());
    this.activeChildOptions.set(children);
  }
}

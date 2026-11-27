/** An item of a Menu. An item with children opens a submenu instead of running an action. */
export interface MenuOption {
  label: string;
  icon?: string;
  disabled?: boolean;
  /** Runs when the item is clicked. Ignored if the item has children. */
  action?: () => void;
  cssClasses?: string;

  /** Submenu items, when they are known in advance. */
  children?: MenuOption[];
  /** Loads the submenu items when the pointer enters the item (e.g. from the API). */
  getChildren?: () => MenuOption[] | Promise<MenuOption[]>;
}

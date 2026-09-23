export interface MenuOption {
  label: string;
  icon?: string;
  disabled?: boolean;
  action?: () => void;
  cssClasses?: string;

  children?: MenuOption[];
  getChildren?: () => MenuOption[] | Promise<MenuOption[]>;
}

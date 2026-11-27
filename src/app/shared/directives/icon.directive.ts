import {
  afterRenderEffect,
  ComponentRef,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injector,
  input,
  Renderer2,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import { NG_ICON_LIST } from '../models/ng-icon-list';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CUSTOM_ICON_LIST, CustomIconName } from '../models/custom-icon-list';

/**
 * Renders an icon inside any element. Two sources are supported:
 *  - ng-icons library: a key of NG_ICON_LIST (e.g. "bootstrapClock").
 *  - Custom SVGs bundled with the app: a key of CUSTOM_ICON_LIST (e.g. "church-logo").
 *
 * If a name exists in both lists, the library icon wins.
 *
 * Usage:
 *   <span appIcon="bootstrapClock"></span>
 *   <span appIcon="church-logo" [size]="32" class="text-primary"></span>
 *
 * Icons inherit the text color (currentColor). Custom SVGs need a viewBox and should use
 * fill/stroke="currentColor" instead of hardcoded colors to follow the text color.
 */
@Directive({
  selector: '[appIcon]',
  providers: [provideIcons(NG_ICON_LIST)],
  host: {
    'aria-hidden': 'true',
    '[style.display]': '"inline-flex"',
    '[style.width]': 'cssSize()',
    '[style.height]': 'cssSize()',
  },
})
export class IconDirective {
  /** Library icon key or custom icon key. */
  public appIcon = input.required<AppIconName>();

  /** Icon size. A number is read as pixels, a string as any CSS size (e.g. "1.5rem").
   * Default size is 24px.
   */
  public size = input<number | string>(24);

  protected cssSize = computed(() => {
    const size = this.size();
    return typeof size === 'number' ? `${size}px` : size;
  });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly injector = inject(Injector);

  private libraryRef?: ComponentRef<NgIcon>;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clear());

    afterRenderEffect(() => {
      const name = this.appIcon();
      const size = this.cssSize();

      untracked(() => {
        this.clear();

        if (this.isLibraryIcon(name)) {
          this.renderLibraryIcon(name, size);
        } else {
          this.renderCustomIcon(name);
        }
      });
    });
  }

  private isLibraryIcon(name: AppIconName): name is LibraryIconName {
    return Object.hasOwn(NG_ICON_LIST, name);
  }

  private renderLibraryIcon(name: LibraryIconName, size: string): void {
    const componentRef = this.viewContainer.createComponent(NgIcon, { injector: this.injector });
    componentRef.setInput('name', name);
    componentRef.setInput('size', size);

    const element = componentRef.location.nativeElement as HTMLElement;
    element.style.display = 'block';

    this.el.appendChild(element);
    this.libraryRef = componentRef;
  }

  private renderCustomIcon(name: CustomIconName) {
    // The SVG is bundled at build time from our own files, so it is trusted markup
    this.el.innerHTML = CUSTOM_ICON_LIST[name];

    // Make the SVG fill the host element, which controls the size
    const svgElement = this.el.firstElementChild;
    svgElement?.setAttribute('width', '100%');
    svgElement?.setAttribute('height', '100%');
  }

  private clear(): void {
    this.libraryRef?.destroy();
    this.libraryRef = undefined;

    while (this.el.firstChild) {
      this.renderer.removeChild(this.el, this.el.firstChild);
    }
  }
}

export type LibraryIconName = keyof typeof NG_ICON_LIST;

/** Every valid icon name: keys of NG_ICON_LIST plus keys of CUSTOM_ICON_LIST. */
export type AppIconName = LibraryIconName | CustomIconName;

import {
  ConnectedPosition,
  Overlay,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import {
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AppError } from '../../core/errors/app-error';
import { TemplatePortal } from '@angular/cdk/portal';
import { filter, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[appOverlay]',
  host: {
    role: 'button',
    tabindex: '0',
    '(click)': 'onClck($event)',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '[attr.aria-haspopup]': '!enabledOnHover()',
    '[attr.aria-expanded]': 'isOpen()',
  },
})
export class OverlayDirective implements OnDestroy {
  private element: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private cdkOverlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);
  private destroyRef = inject(DestroyRef);

  public appOverlay = input<TemplateRef<unknown>>();
  public overlayWidth = input<string>('fit-content');
  public overlayHeight = input<string>('auto');
  public position = input<OverlayPosition>('auto');
  public scrollBehaviour = input<OverlayScrollBehaviour>('repositionAutoClose');
  public orientation = input<OverlayOrientation>('auto');
  public enabledOnHover = input<boolean>(false);
  public overlayOffset = input<number>(4);
  public globalOffset = input<string>();
  public enterDelay = input<number>(100);
  public leaveDelay = input<number>(200);
  public overlayClasses = input<string | string[]>('rounded');
  // Transition properties
  public enableTransition = input<boolean>(true);
  public transitionClasses = input<string>('transition ease-out duration-200');
  public enterFromClass = input<string>('opacity-0 scale-95');
  public enterToClass = input<string>('opacity-100 scale-100');
  public leaveFromClass = input<string>('opacity-100 scale-100');
  public leaveToClass = input<string>('opacity-0 scale-95');
  public transitionFallbackMs = input<number>(300);

  public readonly isOpen = signal<boolean>(false);

  /** True from the start of the leave animation until the overlay is detached. */
  public readonly isClosing = signal<boolean>(false);

  private overlayRef?: OverlayRef;
  private hoverTimer?: ReturnType<typeof setTimeout>;
  private currentClasses: string | string[] = [];

  private get isGlobal(): boolean {
    if (
      this.position() === 'globalCenter' ||
      this.position() === 'globalStart' ||
      this.position() === 'globalEnd'
    ) {
      return true;
    }
    return false;
  }

  constructor() {
    effect(() => {
      const width = this.overlayWidth();
      const height = this.overlayHeight();
      this.overlayRef?.updateSize({ width, height });
    });
    effect(() => {
      this.position();
      this.orientation();
      this.overlayOffset();
      this.globalOffset();
      this.overlayRef?.updatePositionStrategy(this.getPositionStrategy());
    });
    effect(() => {
      this.scrollBehaviour();
      this.overlayRef?.updateScrollStrategy(this.getScrollStrategy());
    });
    effect(() => {
      this.overlayClasses();
      this.overlayRef?.removePanelClass(this.currentClasses);
      this.overlayRef?.addPanelClass(this.overlayClasses());
      this.currentClasses = this.overlayClasses();
    });
  }

  public ngOnDestroy(): void {
    clearTimeout(this.hoverTimer);
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  protected onClck(ev: PointerEvent) {
    if (!this.appOverlay()) {
      return;
    }
    const pointerType = ev instanceof PointerEvent ? ev.pointerType : undefined;
    if (this.enabledOnHover() && pointerType === 'mouse') {
      return;
    }
    this.toggleOverlay();
  }

  protected toggleOverlay() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  public close() {
    // Ignore the call if it is already closing, so a double click does not stack two transitions
    if (!this.overlayRef || !this.isOpen() || this.isClosing()) {
      return;
    }
    if (!this.enableTransition()) {
      this.overlayRef.detach();
      return;
    }
    this.runLeaveTransition();
  }

  public open() {
    const template = this.appOverlay();
    if (!template || this.isOpen()) {
      return;
    }
    if (this.isOpen()) {
      return;
    }
    if (!this.overlayRef) {
      this.overlayRef = this.cdkOverlay.create({
        scrollStrategy: this.getScrollStrategy(),
        positionStrategy: this.getPositionStrategy(),
        minWidth: '0',
        width: this.overlayWidth(),
        maxWidth: '100%',
        minHeight: '0',
        height: this.overlayHeight(),
        maxHeight: '100%',
        panelClass: this.overlayClasses(),
      });
      this.currentClasses = this.overlayClasses();

      fromEvent(this.overlayRef.overlayElement, 'mouseenter')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.onMouseEnter());

      fromEvent(this.overlayRef.overlayElement, 'mouseleave')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.onMouseLeave());

      this.overlayRef
        .outsidePointerEvents()
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          filter((ev) => !this.element.nativeElement.contains(ev.target as Node)),
        )
        .subscribe(() => this.close());

      this.overlayRef
        .keydownEvents()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((ev) => {
          if (ev.code === 'Escape') {
            const focusWasInside = this.overlayRef!.overlayElement.contains(document.activeElement);
            this.close();
            if (focusWasInside) {
              this.element.nativeElement.focus();
            }
          }
        });

      this.overlayRef
        .detachments()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.isOpen.set(false);
          this.isClosing.set(false);
        });

      this.overlayRef
        .attachments()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.isOpen.set(true);
          if (this.enableTransition()) {
            this.runEnterTransition();
          }
        });
    }

    const templatePortal = new TemplatePortal(template, this.vcr);
    this.overlayRef.attach(templatePortal);
  }

  /**
   * Computes the transform-origin by comparing the REAL position of the already rendered
   * overlay (getBoundingClientRect) against the trigger, instead of relying on an
   * asynchronous event like `positionChanges`. Since `positionStrategy.apply()` runs
   * synchronously inside `overlayRef.attach()` before `attachments()` emits, the DOM is
   * already in its final position when this runs — even on the first `open()` — so there
   * is no race condition.
   */
  private getTransformOrigin(): string {
    const el = this.overlayRef?.overlayElement;
    if (!el) {
      return 'center';
    }

    const overlayRect = el.getBoundingClientRect();
    const triggerRect = this.element.nativeElement.getBoundingClientRect();
    const tolerance = 1; // px, to absorb subpixel rounding

    let vertical: 'top' | 'bottom' | 'center';
    if (overlayRect.top >= triggerRect.bottom - tolerance) {
      vertical = 'top'; // the overlay ended up below the trigger
    } else if (overlayRect.bottom <= triggerRect.top + tolerance) {
      vertical = 'bottom'; // the overlay ended up above the trigger
    } else {
      vertical = 'center'; // vertically aligned (start/end position)
    }

    const distanceLeft = Math.abs(overlayRect.left - triggerRect.left);
    const distanceRight = Math.abs(overlayRect.right - triggerRect.right);
    const horizontal = distanceLeft <= distanceRight ? 'left' : 'right';

    return `${vertical} ${horizontal}`;
  }

  private runEnterTransition() {
    const el = this.overlayRef?.overlayElement;
    if (!el) {
      return;
    }

    const from = this.enterFromClass().split(' ').filter(Boolean);
    const to = this.enterToClass().split(' ').filter(Boolean);

    // Hide immediately (same tick as the attach, with no transition class yet) so the user
    // never sees the intermediate/mispositioned state of the first render.
    el.classList.add(...from);

    // The content (ng-content inside the ng-template) may not have its final layout resolved
    // yet in the same tick as attach(). We force CDK to re-measure and re-position with the
    // real, stable size before capturing the transform-origin and starting the transition.
    // Without this, on the first open CDK can position using a slightly different measurement
    // than the final one, and that adjustment shows up as a jump/drop.
    requestAnimationFrame(() => {
      this.overlayRef?.updatePosition();

      requestAnimationFrame(() => {
        if (!this.overlayRef) {
          return;
        }

        el.style.transformOrigin = this.getTransformOrigin();

        const base = this.transitionClasses().split(' ').filter(Boolean);
        el.classList.add(...base);
        void el.offsetHeight;
        requestAnimationFrame(() => {
          el.classList.remove(...from);
          el.classList.add(...to);
        });
      });
    });
  }

  private runLeaveTransition() {
    const el = this.overlayRef?.overlayElement;
    if (!el) {
      this.overlayRef?.detach();
      return;
    }

    this.isClosing.set(true);

    el.style.transformOrigin = this.getTransformOrigin();

    const base = this.transitionClasses().split(' ').filter(Boolean);
    const from = this.leaveFromClass().split(' ').filter(Boolean);
    const to = this.leaveToClass().split(' ').filter(Boolean);

    let done = false;
    const finish = () => {
      if (done) {
        return;
      }
      done = true;
      el.removeEventListener('transitionend', onEnd);
      clearTimeout(fallback);
      this.overlayRef?.detach();
    };
    const onEnd = (ev: TransitionEvent) => {
      if (ev.target === el) {
        finish();
      }
    };

    el.classList.add(...base, ...from);
    void el.offsetHeight;
    requestAnimationFrame(() => {
      el.classList.remove(...from);
      el.classList.add(...to);
    });

    el.addEventListener('transitionend', onEnd);
    const fallback = setTimeout(finish, this.transitionFallbackMs());
  }

  protected onMouseEnter() {
    if (!this.enabledOnHover() || this.isGlobal) {
      return;
    }
    this.scheduleHover(true);
  }

  protected onMouseLeave() {
    if (!this.enabledOnHover() || this.isGlobal) {
      return;
    }
    this.scheduleHover(false);
  }

  private scheduleHover(shouldOpen: boolean) {
    clearTimeout(this.hoverTimer);
    this.hoverTimer = setTimeout(
      () => (shouldOpen ? this.open() : this.close()),
      shouldOpen ? this.enterDelay() : this.leaveDelay(),
    );
  }
  private getScrollStrategy(): ScrollStrategy {
    switch (this.scrollBehaviour()) {
      case 'blockPageScroll':
        return this.cdkOverlay.scrollStrategies.block();
      case 'close':
        return this.cdkOverlay.scrollStrategies.close();
      case 'fixed':
        return this.cdkOverlay.scrollStrategies.noop();
      case 'reposition':
        return this.cdkOverlay.scrollStrategies.reposition();
      case 'repositionAutoClose':
        return this.cdkOverlay.scrollStrategies.reposition({ autoClose: true });
    }
  }
  private getPositionStrategy(): PositionStrategy {
    switch (this.position()) {
      case 'globalCenter':
        return this.cdkOverlay.position().global().centerHorizontally().centerVertically();
      case 'globalStart':
        return this.cdkOverlay
          .position()
          .global()
          .start(this.globalOffset())
          .bottom(this.globalOffset());
      case 'globalEnd':
        return this.cdkOverlay
          .position()
          .global()
          .end(this.globalOffset())
          .bottom(this.globalOffset());
      case 'auto':
      case 'top':
      case 'bottom':
      case 'end':
      case 'start':
        return this.cdkOverlay
          .position()
          .flexibleConnectedTo(this.element)
          .withPositions(this.getConnectedPositions())
          .withFlexibleDimensions(true)
          .withPush(true);
      default:
        throw new AppError(
          `Position not implemented in the function 'getPositionStrategy': ${this.position()}`,
          'INTERNAL_ERROR',
          true,
        );
    }
  }

  private getConnectedPositions(): ConnectedPosition[] {
    const position = this.position() as ConnectedOverlayPosition | 'auto';
    const orientation = this.orientation();
    const offset = this.overlayOffset();

    const overlayPositions: Record<ConnectedOverlayPosition, ConnectedPosition[]> = {
      bottom: [
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: offset,
        },
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: offset,
        },
        { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: offset },
      ],
      top: [
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -offset,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -offset,
        },
        { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -offset },
      ],
      start: [
        {
          originX: 'start',
          originY: 'center',
          overlayX: 'end',
          overlayY: 'center',
          offsetX: -offset,
        },
        { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -offset },
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetX: -offset,
        },
      ],
      end: [
        {
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: offset,
        },
        { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: offset },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetX: offset,
        },
      ],
    };

    let result: ConnectedPosition[];
    let orientationIndex: number;
    if (position === 'auto') {
      if (orientation === 'auto') {
        result = [
          ...overlayPositions.bottom,
          ...overlayPositions.top,
          ...overlayPositions.end,
          ...overlayPositions.start,
        ];
      } else {
        orientationIndex = this.getOrientationIndex(orientation);
        result = [
          overlayPositions.bottom[orientationIndex],
          overlayPositions.top[orientationIndex],
          overlayPositions.end[orientationIndex],
          overlayPositions.start[orientationIndex],
        ];
      }
    } else {
      if (orientation === 'auto') {
        result = overlayPositions[position];
      } else {
        orientationIndex = this.getOrientationIndex(orientation);
        result = [overlayPositions[position][orientationIndex]];
      }
    }
    return result;
  }

  private getOrientationIndex(orientation: Exclude<OverlayOrientation, 'auto'>): number {
    switch (orientation) {
      case 'center':
        return 0;
      case 'start':
        return 1;
      case 'end':
        return 2;
    }
  }
}

export type OverlayPosition =
  'auto' | 'top' | 'bottom' | 'start' | 'end' | 'globalCenter' | 'globalStart' | 'globalEnd';

type ConnectedOverlayPosition = 'top' | 'bottom' | 'start' | 'end';

export type OverlayOrientation = 'auto' | 'start' | 'end' | 'center';

export type OverlayScrollBehaviour =
  'reposition' | 'close' | 'blockPageScroll' | 'fixed' | 'repositionAutoClose';

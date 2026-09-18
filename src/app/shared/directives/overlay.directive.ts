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

  public appOverlay = input.required<TemplateRef<unknown>>();
  public overlayWidth = input.required<string>();
  public overlayHeight = input.required<string>();
  public position = input<OverlayPosition>('auto');
  public scrollBehaviour = input<OverlayScrollBehaviour>('repositionAutoClose');
  public orientation = input<OverlayOrientation>('auto');
  public enabledOnHover = input<boolean>(false);
  public overlayOffset = input<number>(5);
  public globalOffset = input<string>();
  public enterDelay = input<number>(100);
  public leaveDelay = input<number>(100);
  public overlayClasses = input<string | string[]>('rounded');

  public readonly isOpen = signal<boolean>(false);

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
    if (!this.overlayRef || !this.isOpen()) {
      return;
    }
    this.overlayRef.detach();
  }

  public open() {
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
        .subscribe(() => this.isOpen.set(false));

      this.overlayRef
        .attachments()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.isOpen.set(true));
    }

    const templatePortal = new TemplatePortal(this.appOverlay(), this.vcr);
    this.overlayRef.attach(templatePortal);
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
          .withGrowAfterOpen(true)
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
